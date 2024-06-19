<script lang="ts">
    import * as Table from "$lib/components/ui/table/index.js";
    import { createEventDispatcher } from 'svelte';
    import { Button } from '$lib/components/ui/button';
    import type { StudentData } from './types';
    import { db } from '$lib/services/firebase';
    import { deleteDoc, doc } from 'firebase/firestore';
    import { Ellipsis } from 'lucide-svelte';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
   
    export let students: StudentData[];

    const dispatch = createEventDispatcher();

    function handleDelete(student: StudentData) {
        const courseDocRef = doc(db, 'students', student.id);
        deleteDoc(courseDocRef)
        .then(() => {
            console.log('Course deleted successfully');
        })
        .catch((error) => {
            console.error('Error deleting course: ', error);
        });
    }

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
        <Table.Head>Email</Table.Head>
        <Table.Head>Phone</Table.Head>
        <Table.Head>Course Name</Table.Head>
        <Table.Head>Status</Table.Head>
        <Table.Head class="text-right">Actions</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each students as student, i (student.id)}
        <Table.Row>
          <Table.Cell class="font-medium">{student.id}</Table.Cell>
          <Table.Cell>{student.firstName}{student.lastName}</Table.Cell>
          <Table.Cell>{student.email}</Table.Cell>
          <Table.Cell>{student.phone}</Table.Cell>
          <Table.Cell>{student.courses}</Table.Cell>
          <Table.Cell>{student.courseStatus}</Table.Cell>
          <Table.Cell>{student.status}</Table.Cell>
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
                  <DropdownMenu.Item on:click={() => handleDelete(student)}>
                    <span>Delete</span>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>