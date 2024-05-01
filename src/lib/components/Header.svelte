<script lang="ts">
    import { Sun } from 'lucide-svelte'
	import { Moon } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { toggleMode } from 'mode-watcher';
	import { DashboardMainNav, Search, UserNav } from '$lib/components/dashboardui/index';
</script>

<div class="border-b shadow-sm bg-background text-foreground">
	<div class="flex h-16 items-center px-4">
		<div class="mr-auto flex items-center glow-border shadow-md space-x-4">
			<DashboardMainNav />
		</div>
		<div class="ml-auto flex items-center space-x-4">
			<!-- <Search /> -->
			<!-- <UserNav /> -->
			<div class="glow-border">
				<Button on:click={toggleMode} variant="outline" size="icon">
					<Sun
						class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
					<Moon
						class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>
					<span class="sr-only">Toggle theme</span>
				</Button>
			</div>
		</div>
	</div>
</div>
