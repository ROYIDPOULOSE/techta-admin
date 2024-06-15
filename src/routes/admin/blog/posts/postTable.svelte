<script lang="ts">
    import * as Table from "$lib/components/ui/table/index.js";
    import { createEventDispatcher } from 'svelte';
    import { Button } from '$lib/components/ui/button';
    import type { BlogData } from './types';
    import { deleteDoc, doc } from 'firebase/firestore';
    import { Ellipsis } from 'lucide-svelte';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
    import { onSnapshot, collection, Timestamp } from 'firebase/firestore';
    import { db } from '$lib/services/firebase';
    import { goto } from '$app/navigation';
   
    let blogs: BlogData[] = [];

    const unsubscribe = onSnapshot(collection(db, 'blogs'), (snapshot) => {
        blogs = snapshot.docs.map((doc) => {
            const data = doc.data();
            const lastUpdated = data.lastUpdated
                ? new Timestamp(data.lastUpdated.seconds, data.lastUpdated.nanoseconds)
                : null;
            return {
                id: doc.id,
                ...data,
                lastUpdated,
            } as BlogData;
        });
    });

    const dispatch = createEventDispatcher();

    function handleDelete(blog: BlogData) {
        const courseDocRef = doc(db, 'blogs', blog.id);
        deleteDoc(courseDocRef)
        .then(() => {
            console.log('Course deleted successfully');
        })
        .catch((error) => {
            console.error('Error deleting course: ', error);
        });
    }

    function handleEditClick(blog: BlogData) {
        goto(`/admin/blog/addNewPost?id=${blog.id}`);
    }
  </script>
   
  <Table.Root>
    <Table.Caption>blogs</Table.Caption>
    <Table.Header>
      <Table.Row>
        <Table.Head class="w-[100px]">ID</Table.Head>
        <Table.Head>Title</Table.Head>
        <Table.Head>Auther</Table.Head>
        <Table.Head>Date</Table.Head>
        <Table.Head>Status</Table.Head>
        <Table.Head>Priority</Table.Head>
        <Table.Head class="text-right">Actions</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each blogs as blog, i (blog.id)}
        <Table.Row>
          <Table.Cell class="font-medium">{blog.id}</Table.Cell>
          <Table.Cell>{blog.title}</Table.Cell>
          <Table.Cell>{blog.auther}</Table.Cell>
          <Table.Cell>{blog.date}</Table.Cell>
          <Table.Cell>{blog.status}</Table.Cell>
          <Table.Cell>{blog.priority}</Table.Cell>
          <Table.Cell class="text-right">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button variant="ghost" size="sm">
                    <Ellipsis />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item on:click={() => handleEditClick(blog)}>
                      <span>View</span>
                      </DropdownMenu.Item>
                  <DropdownMenu.Item on:click={() => handleEditClick(blog)}>
                        <span>Edit</span>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item on:click={() => handleDelete(blog)}>
                        <span>Delete</span>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>