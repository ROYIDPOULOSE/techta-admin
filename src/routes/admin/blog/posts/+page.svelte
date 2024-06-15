<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { goto } from '$app/navigation';
    import PostTable from "./postTable.svelte"

</script>

<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
	<div class="flex items-center">
		<h2 class="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200 flex-1">
			Posts
		</h2>
		<div class="glow-border mr-4">
			<Button variant="outline" 
            class="text-xs flex items-center gap-2 border  px-4 py-1.5"
            on:click={() =>  goto('/admin/blog/addNewPost')}>
				Crate Blog
			</Button>
		</div>
	</div>
    <div class="p-4">
        <PostTable />
    </div>
</div>