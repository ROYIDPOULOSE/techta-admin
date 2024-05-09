<script lang="ts">
    import * as Table from "$lib/components/ui/table/index.js";
    import { createEventDispatcher } from 'svelte';
    import { Button } from '$lib/components/ui/button';
    import { db } from '$lib/services/firebase';
    import { deleteDoc, doc } from 'firebase/firestore';
    import { Ellipsis } from 'lucide-svelte';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
    import type { SoftwareData } from "./types";

    export let softwares: SoftwareData[];

    const dispatch = createEventDispatcher();

    function handleDelete(software: SoftwareData) {
        const courseDocRef = doc(db, 'softwares', software.id);
        deleteDoc(courseDocRef)
        .then(() => {
            console.log('Course deleted successfully');
        })
        .catch((error) => {
            console.error('Error deleting course: ', error);
        });
    }

    function handleEditClick(software: SoftwareData) {
        dispatch('edit', software);
    }
  </script>
   
  <Table.Root>
    <Table.Caption>Softwares</Table.Caption>
    <Table.Header>
      <Table.Row>
        <Table.Head>Software Name</Table.Head>
        <Table.Head>doration</Table.Head>
        <!-- <Table.Head class="text-right">Actions</Table.Head> -->
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each softwares as software, i (software.id)}
        <Table.Row>
          <!-- <Table.Cell class="font-medium">{software.id}</Table.Cell> -->
          <Table.Cell>{software.software_name}</Table.Cell>
          <Table.Cell>{software.duration}</Table.Cell>
          <Table.Cell class="text-right">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button variant="ghost" size="sm">
                    <Ellipsis />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item on:click={() => handleEditClick(software)}>
                    <span>Edit</span>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item on:click={() => handleDelete(software)}>
                    <span>Delete</span>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>