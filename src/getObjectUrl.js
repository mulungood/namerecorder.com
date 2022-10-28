import { env } from '$env/dynamic/public'

export function getObjectUrl(user_id) {
	return `${env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/pronunciations/${user_id}/name.mp3`
}
