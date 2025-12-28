#!/bin/bash

# Create SSL directory if it doesn't exist
mkdir -p ssl

# Generate self-signed SSL certificate with IP SAN
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/key.pem \
  -out ssl/cert.pem \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:192.168.0.241"

echo "✅ SSL certificates generated successfully!"
echo "📁 Location: ./ssl/"
echo "🔒 Valid for: 365 days"
echo ""
echo "Note: This is a self-signed certificate. Your browser will show a security warning."
echo "To proceed, click 'Advanced' and 'Continue to localhost (unsafe)'."
