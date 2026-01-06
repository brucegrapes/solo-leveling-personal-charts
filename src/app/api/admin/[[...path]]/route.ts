import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-helpers';
import { UserRole } from '@/models/User';
import connectDB from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

async function checkAdminAuth() {
  const user = await getCurrentUser();
  if (!user || user.role !== UserRole.SYSTEM_DESIGNER) {
    return false;
  }
  return true;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  try {
    const isAuthorized = await checkAdminAuth();
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized: System Designer role required' },
        { status: 403 }
      );
    }

    await connectDB();
    
    // Return a message that AdminJS panel is embedded in the admin page
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>AdminJS</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
              color: white;
              font-family: system-ui, -apple-system, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .container {
              text-align: center;
              max-width: 600px;
            }
            h1 { color: #a855f7; margin-bottom: 20px; }
            p { color: #d1d5db; margin-bottom: 30px; }
            a {
              display: inline-block;
              padding: 12px 24px;
              background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
              color: white;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              transition: transform 0.2s;
            }
            a:hover { transform: scale(1.05); }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>⚡ AdminJS Integration</h1>
            <p>AdminJS is integrated into the main admin panel. Please use the full admin interface for complete functionality including analytics, user management, and code console.</p>
            <a href="/admin">Go to Admin Panel</a>
          </div>
        </body>
      </html>`,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('Admin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> }
) {
  try {
    const isAuthorized = await checkAdminAuth();
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized: System Designer role required' },
        { status: 403 }
      );
    }

    await connectDB();
    const params = await context.params;
    const path = params.path ? params.path.join('/') : '';
    const body = await request.json();

    // Handle AdminJS actions
    return NextResponse.json({ success: true, path, body });
  } catch (error) {
    console.error('Admin POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path?: string[] }> }) {
  return POST(request, context);
}

export async function DELETE(request: NextRequest) {
  try {
    const isAuthorized = await checkAdminAuth();
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized: System Designer role required' },
        { status: 403 }
      );
    }

    await connectDB();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
