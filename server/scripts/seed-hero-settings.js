import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedSettings() {
    const settings = [
        {
            key: 'hero_media_type',
            value: 'image',
            type: 'text',
            category: 'hero',
            language: null,
            description: 'Hero media type: image or video'
        },
        {
            key: 'hero_video_url',
            value: '',
            type: 'text',
            category: 'hero',
            language: null,
            description: 'Hero section background video URL'
        }
    ];

    for (const setting of settings) {
        console.log(`Checking setting: ${setting.key}`);
        const { data, error } = await supabase
            .from('site_settings')
            .select('*')
            .eq('key', setting.key)
            .maybeSingle();

        if (error) {
            console.error(`Error checking ${setting.key}:`, error);
            continue;
        }

        if (!data) {
            console.log(`Inserting missing setting: ${setting.key}`);
            const { error: insertError } = await supabase
                .from('site_settings')
                .insert(setting);

            if (insertError) {
                console.error(`Error inserting ${setting.key}:`, insertError);
            } else {
                console.log(`Successfully inserted ${setting.key}`);
            }
        } else {
            console.log(`Setting ${setting.key} already exists`);
        }
    }
}

seedSettings()
    .then(() => console.log('Done'))
    .catch(err => console.error('Error:', err));
