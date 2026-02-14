#!/bin/bash

# Apply Supabase migration to enable board member access
# Usage: bash scripts/apply-migration.sh

echo "🚀 Applying Supabase migration..."
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Install with:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if linked to Supabase project
if [ ! -f ".env.local" ]; then
    echo "⚠️  No .env.local found. Make sure you've linked your Supabase project:"
    echo "   supabase link"
    exit 1
fi

echo "📡 Pushing migration to Supabase..."
supabase db push

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration applied successfully!"
    echo ""
    echo "Board members can now:"
    echo "  • View shared boards"
    echo "  • View lists and cards"
    echo "  • View comments and labels"
    echo ""
    echo "Only board owners can:"
    echo "  • Edit/create/delete boards, lists, and cards"
    echo ""
else
    echo "❌ Migration failed. Check your Supabase project connection."
    exit 1
fi
