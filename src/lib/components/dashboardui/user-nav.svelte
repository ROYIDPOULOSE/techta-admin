<script lang="ts">
	import * as DropdownMenu from '../ui/dropdown-menu';
	import * as Avatar from '../ui/avatar';
	import { Button } from '../ui/button';
	import { goto } from '$app/navigation';
	import { authHandlers } from '../../store/store'

</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} class="relative h-8 w-8 rounded-full">
			<Avatar.Root class="h-8 w-8">
				<Avatar.Fallback>SC</Avatar.Fallback>
			</Avatar.Root>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56" align="end">
		<DropdownMenu.Label class="font-normal">
			<div class="flex flex-col space-y-1">
				<p class="text-sm font-medium leading-none">Admin</p>
			</div>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item on:click={() => goto('/settings-general')}>Profile</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item on:click={authHandlers.logout}>Log out</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>