<script lang="ts">
	import { cn } from "$lib/utils.js";
	import * as Menubar from "$lib/components/ui/menubar";
	import { goto } from '$app/navigation';
    
	let className: string | undefined | null = undefined;
	export { className as class };

	let menus = [
    {
      name: "Dashboard",
      icon: "fa-house",
      
      items: [
        { name: "Overview", page: "dashboard" },
      ]
    },
    {
      name: "Cources",
      icon: "fa-tag",
      route: "/products",
      items: [
        { name: "Individual Software", page: "customer-group" },
        { name: "Package", page: "reviews" }
      ]
    },
    {
      name: "Students",
      icon: "fa-user",
      
      items: [
        { name: "Individual Software", page: "customer-group" },
        { name: "Package", page: "reviews" }
      ]
    },
     {
      name: "CMS",
      icon: "fa-users-viewfinder",
      
      items: [
	    	{ name: "Hero", page: "hero" },
      ]
    },
    {
      name: "Settings",
      icon: "fa-gear",
      items: [
        { name: "General Settings", page: "settings-general" },
        { name: "Tax Configuration", page: "settings-tax" },
        { name: "Admin Users", page: "settings-admin-users" },
      ]
    },
  ];

	async function navigate(page:string) {
    await goto(page);
  }

</script>

<nav class={cn("flex items-center space-x-4 lg:space-x-6", className)}>
	<Menubar.Root>
		{#each menus as menu}
		  <Menubar.Menu>
			<Menubar.Trigger>{menu.name}</Menubar.Trigger>
			<Menubar.Content>
			  {#if menu.items}
				{#each menu.items as item}
				  <Menubar.Item on:click={() => navigate(`/${item.page}`)}>
					{item.name}
				  </Menubar.Item>
				{/each}
			  {:else}
			  <Menubar.Item on:click={() => navigate(menu.route ?? '')}>
				  View
				</Menubar.Item>
			  {/if}
			</Menubar.Content>
		  </Menubar.Menu>
		{/each}
	  </Menubar.Root>
</nav>