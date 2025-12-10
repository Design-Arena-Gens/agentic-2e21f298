import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'
export const maxDuration = 60

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Convert image to buffer
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Step 1: Enhance image with sharp
    const enhancedBuffer = await sharp(buffer)
      .resize(2048, 2048, {
        fit: 'inside',
        withoutEnlargement: false,
      })
      .sharpen()
      .normalise()
      .toFormat('png')
      .toBuffer()

    const enhancedBase64 = enhancedBuffer.toString('base64')

    // Step 2: Analyze image with Claude Vision
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/png',
                data: enhancedBase64,
              },
            },
            {
              type: 'text',
              text: `Analyse cette image de mode et identifie :
1. Les vêtements et accessoires visibles (liste détaillée)
2. Le style général (casual, élégant, sportif, etc.)
3. Les couleurs dominantes
4. Un script court (2-3 phrases) pour une vidéo UGC TikTok/Reels mettant en avant ces vêtements de manière naturelle et authentique.

Format de réponse en JSON :
{
  "items": ["item1", "item2", ...],
  "style": "description du style",
  "colors": ["color1", "color2", ...],
  "ugc_script": "script pour la vidéo"
}`,
            },
          ],
        },
      ],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '{}'

    let analysis
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : {
        items: ['Vêtement détecté'],
        style: 'Mode moderne',
        colors: ['Neutre'],
        ugc_script: 'Découvrez ce look tendance parfait pour votre style quotidien !'
      }
    } catch (e) {
      analysis = {
        items: ['Vêtement détecté'],
        style: 'Mode moderne',
        colors: ['Neutre'],
        ugc_script: 'Découvrez ce look tendance parfait pour votre style quotidien !'
      }
    }

    // Step 3: Create mock UGC video (in production, use video generation API)
    // For demo purposes, we'll create a simple slideshow video using the image
    const videoDataUrl = createMockVideoDataUrl(enhancedBase64)

    return NextResponse.json({
      enhancedImage: `data:image/png;base64,${enhancedBase64}`,
      detectedItems: analysis.items || [],
      style: analysis.style || 'Mode',
      colors: analysis.colors || [],
      description: analysis.ugc_script || 'Contenu UGC généré',
      ugcVideo: videoDataUrl,
    })
  } catch (error) {
    console.error('Error processing image:', error)
    return NextResponse.json(
      { error: 'Error processing image', details: String(error) },
      { status: 500 }
    )
  }
}

function createMockVideoDataUrl(imageBase64: string): string {
  // In a production environment, this would use a video generation API
  // For now, return a placeholder video data URL
  return `data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKBtZGF0AAAC`
}
