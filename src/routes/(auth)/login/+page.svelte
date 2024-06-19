<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
    import { goto } from '$app/navigation';
    import { Loader } from 'lucide-svelte';
    import { authHandlers } from '$lib/store/store';

    let email: string = '';
    let password: string = '';
    let error = false;
    let authenticating = false;
    let register = false;

    function handleLogin() {
        if (email === 'admin' && password === 'admin') {
            goto('/admin/dashboard');
        } else {
            alert('Invalid email or password');
        }
    }

    async function handleAuthenticate() {
        if (authenticating) {
            return;
        }
        if (!email || !password) {
            error = true;
            return;
        }
        authenticating = true;
        
        try {
            if(!register){
                await authHandlers.login(email, password);
            }
        } catch (err){
            console.log("There was an auth error", err);
            error = true;
            authenticating = false;
        }
    }
</script>

<div class="container">
    <Card.Root class="w-full max-w-sm">
        <Card.Header>
            <Card.Title class="text-2xl">Login</Card.Title>
            <Card.Description>Enter your email below to login to your account.</Card.Description>
        </Card.Header>
        <Card.Content class="grid gap-4">
            {#if error}
                <p class="text-red-700 text-sm"> The information you have entered is not correct</p>
            {/if}
            <div class="grid gap-2">
                <Label for="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required bind:value={email} />
            </div>
            <div class="grid gap-2">
                <Label for="password">Password</Label>
                <Input id="password" type="password" required bind:value={password}/>
            </div>
        </Card.Content>
        <Card.Footer>
            <Button class="w-full" on:click={handleAuthenticate}>
                {#if authenticating}
                    <Loader class="animate-spin"/>
                {:else}
                    Sign in
                {/if}
            </Button>
        </Card.Footer>
    </Card.Root>
</div>

<style>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
    }
</style>
