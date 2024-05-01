<script lang="ts">
    import type { LayoutData } from './$types';
    import Header from '$lib/components/Header.svelte';
    
    export let data: LayoutData;
</script>

<div class="relative min-h-screen w-full bg-muted  dark:bg-neutral-950 text-foreground">
    <div class="">
        <Header />
        <main  >
            <slot />
        </main>
    </div>
</div>