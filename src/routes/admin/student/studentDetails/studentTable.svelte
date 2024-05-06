<script lang="ts">
    import * as Table from "$lib/components/ui/table/index.js";
    import { createEventDispatcher } from 'svelte';
    import { Button } from '$lib/components/ui/button';
    import type { StudentData } from './types';
    import { Ellipsis } from 'lucide-svelte';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
   
    export let students: StudentData[];

    const dispatch = createEventDispatcher();

    function handleEditClick(student: StudentData) {
        dispatch('edit', student);
    }
  </script>
   
  <Table.Root>
    <Table.Caption>Student Details</Table.Caption>
    <Table.Header>
      <Table.Row>
        <Table.Head class="w-[100px]">Student ID</Table.Head>
        <Table.Head>Name</Table.Head>
        <Table.Head>Address</Table.Head>
        <Table.Head>Phone</Table.Head>
        <Table.Head>Status</Table.Head>
        <Table.Head>Course</Table.Head>
        <Table.Head class="text-right">Actions</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each students as student, i (student.id)}
        <Table.Row>
          <Table.Cell class="font-medium">{student.id}</Table.Cell>
          <Table.Cell>{student.name}</Table.Cell>
          <Table.Cell>{student.address}</Table.Cell>
          <Table.Cell>{student.phone}</Table.Cell>
          <Table.Cell>{student.status}</Table.Cell>
          <Table.Cell>{student.course}</Table.Cell>
          <Table.Cell class="text-right">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button variant="ghost" size="sm">
                    <Ellipsis />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item on:click={() => handleEditClick(student)}>
                    <span>Edit</span>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item>
                    <span>Delete</span>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>