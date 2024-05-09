<script lang="ts">
    import Header from '$lib/components/Header.svelte';
</script>

<div class="relative min-h-screen w-full bg-muted  dark:bg-neutral-950 text-foreground">
    <div class="">
        <Header />
        <main  >
            <slot />
        </main>
    </div>
</div>