<script lang="ts">
	import { cn } from '$lib/utils.js';
	import * as Menubar from '$lib/components/ui/menubar';
	import { goto } from '$app/navigation';
	import { menuItems } from '$lib/menuItems';

	let className: string | undefined | null = undefined;
	export { className as class };

	async function navigate(page: string) {
    const navigateTo = page.startsWith('/') ? page : `/${page}`;
    await goto(navigateTo);
    // window.location.href = navigateTo;
	}
</script>

<nav class={cn('flex items-center space-x-4 lg:space-x-6', className)}>
	<Menubar.Root>
		{#each menuItems as menu}
			<Menubar.Menu>
				<Menubar.Trigger>{menu.name}</Menubar.Trigger>
				<Menubar.Content>
					{#if menu.items}
						{#each menu.items as item}
							<Menubar.Item on:click={() => navigate(item.page)}>
								{item.name}
							</Menubar.Item>
						{/each}
					{/if}
				</Menubar.Content>
			</Menubar.Menu>
		{/each}
	</Menubar.Root>
</nav>