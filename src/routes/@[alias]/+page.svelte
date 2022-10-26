<script>
	import { getObjectUrl } from '../../getObjectUrl'

	export let data
</script>

<h1>@{data.alias}</h1>

<audio src={getObjectUrl(data.user_id)} controls />
