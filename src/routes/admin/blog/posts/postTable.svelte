<script lang="ts">
    import * as Table from "$lib/components/ui/table/index.js";
    import { createEventDispatcher } from 'svelte';
    import { Button } from '$lib/components/ui/button';
    import type { BlogData } from './types';
    import { deleteDoc, doc } from 'firebase/firestore';
    import { Ellipsis } from 'lucide-svelte';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
    import { onSnapshot, collection, Timestamp } from 'firebase/firestore';
    import { deleteObject, ref as storageRef } from 'firebase/storage';
    import { storage } from '$lib/services/firebase';
    import { db } from '$lib/services/firebase';
    import { goto } from '$app/navigation';
    import { onDestroy } from 'svelte';
   
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
                imageUrl: data.imageUrl || '',
                authorImageUrl: data.authorImageUrl || '',
                lastUpdated,
            } as BlogData;
        });
    });

    const dispatch = createEventDispatcher();

    async function handleDelete(blog: BlogData) {
        if (confirm(`Are you sure you want to delete the blog "${blog.title}"?`)) {
            try {
                await deleteDoc(doc(db, 'blogs', blog.id));

                if (blog.imageUrl) {
                    const imageRef = storageRef(storage, blog.imageUrl);
                    await deleteObject(imageRef);
                }

                if (blog.authorImageUrl) {
                    const authorImageRef = storageRef(storage, blog.authorImageUrl);
                    await deleteObject(authorImageRef);
                }

                console.log('Blog and associated images deleted successfully');
            } catch (error) {
                console.error('Error deleting blog and images: ', error);
            }
        }
    }

    function handleEditClick(blog: BlogData) {
        goto(`/admin/blog/addNewPost?id=${blog.id}`);
    }

    onDestroy(() => {
        unsubscribe();
    });
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