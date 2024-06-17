<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import * as Card from "$lib/components/ui/card/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Textarea } from "$lib/components/ui/textarea/index.js";
    import { goto } from '$app/navigation';
    import { db, storage } from '$lib/services/firebase';
    import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
    import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
    import { page } from '$app/stores';
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    
    $: hasUnsavedChanges = browser && (title !== "" || permalink !== "" || description !== "" || 
    selectedStatus !== "" || selectedPriority !== "" || selectedImageUrl !== "/favicon.png");
    
    let imageUpload: HTMLInputElement;
    let selectedImageUrl = "/favicon.png";
    let title = "";
    let permalink = "";
    let description = "";
    let selectedStatus = "";
    let selectedPriority = "";
    let blogId: string | null = null;
    let isEditing = false;
    let authorImageUpload: HTMLInputElement;
    let selectedAuthorImageUrl = "/favicon.png";
    let authorName = "";
    let autherDesignation = "";

    const status = [
      { value: "Public", label: "public" },
      { value: "Private", label: "private" },
    ];

    const priority = [
      { value: "High", label: "high" },
      { value: "Medium", label: "medium" },
      { value: "Low", label: "low" },
    ];

    function pickAuthorAvatar() {
        authorImageUpload.click();
    }

    function handleAuthorImageUpload(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            selectedAuthorImageUrl = URL.createObjectURL(file);
        }
    }

    function pickAvatar() {
        imageUpload.click();
    }

    function handleImageUpload(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            selectedImageUrl = URL.createObjectURL(file);
            if (isEditing) {
                alert("New image selected. Don't forget to click 'Update Blog' to save changes.");
            }
        }
    }

    async function createOrUpdateBlog() {
        let imageUrl = selectedImageUrl;
        let authorImageUrl = selectedAuthorImageUrl;

        if (browser && imageUpload && imageUpload.files && imageUpload.files.length > 0) {
            const file = imageUpload.files[0];
            const storageRef = ref(storage, 'blog_images/' + file.name);
            
            try {
                await uploadBytes(storageRef, file);
                
                imageUrl = await getDownloadURL(storageRef);
            } catch (error) {
                console.error("Error uploading image: ", error);
                alert("An error occurred while uploading the image.");
                return;
            }
        } else if (!isEditing) {
            alert("Please select an image");
            return;
        }

        if (browser && authorImageUpload && authorImageUpload.files && authorImageUpload.files.length > 0) {
            const file = authorImageUpload.files[0];
            const storageRef = ref(storage, 'author_images/' + file.name);
            
            try {
                await uploadBytes(storageRef, file);
                authorImageUrl = await getDownloadURL(storageRef);
            } catch (error) {
                console.error("Error uploading author image: ", error);
                alert("An error occurred while uploading the author image.");
                return;
            }
        }
        
        try {
            const blogData = {
                title,
                permalink,
                description,
                status: selectedStatus,
                priority: selectedPriority,
                imageUrl,
                authorName,
                autherDesignation,
                authorImageUrl,
                lastUpdated: new Date()
            };

            if (isEditing && blogId) {
                await updateDoc(doc(db, "blogs", blogId), blogData);
                console.log("Blog updated successfully");
            } else {
                const docRef = await addDoc(collection(db, "blogs"), {
                    ...blogData,
                    createdAt: new Date()
                });
                console.log("Blog created with ID: ", docRef.id);
            }
            
            alert(isEditing ? "Blog updated successfully!" : "Blog created successfully!");

            resetForm();
            
            goto('/admin/blog/posts');
        } catch (error) {
            console.error("Error creating/updating blog: ", error);
            alert("An error occurred while creating/updating the blog.");
        }
    }

    function resetForm() {
        title = "";
        permalink = "";
        description = "";
        selectedStatus = "";
        selectedPriority = "";
        selectedImageUrl = "/favicon.png";
        authorName = "";
        autherDesignation = "";
        selectedAuthorImageUrl = "/favicon.png";
        if (browser && imageUpload) {
            imageUpload.value = "";
        }
        blogId = null;
        isEditing = false;
    }

    function handleBeforeUnload(event: BeforeUnloadEvent) {
        if (hasUnsavedChanges) {
            event.preventDefault();
            event.returnValue = "";
        }
    }

    onMount(async () => {
        if (browser) {
            try {
                resetForm();
                
                blogId = $page.url.searchParams.get('id');
                if (blogId) {
                    isEditing = true;
                    try{
                        const blogDoc = await getDoc(doc(db, 'blogs', blogId));
                        if (blogDoc.exists()) {
                            const blogData = blogDoc.data();
                            title = blogData.title;
                            permalink = blogData.permalink;
                            description = blogData.description;
                            selectedStatus = blogData.status;
                            selectedPriority = blogData.priority;
                            selectedImageUrl = blogData.imageUrl;
                            authorName = blogData.authorName || "";
                            autherDesignation = blogData.autherDesignation || "";
                            selectedAuthorImageUrl = blogData.authorImageUrl || "/favicon.png";
                        } else {
                            console.error('No such document!');
                        }
                    }catch (error) {
                        console.error('Error fetching document:', error);
                    }
                }

                window.addEventListener('beforeunload', handleBeforeUnload);
            } catch (error) {
                console.error('Error in onMount:', error);
            }
        }
    });

    onDestroy(() => {
        resetForm();
        if (browser) {
            window.addEventListener('beforeunload', handleBeforeUnload);
        }
    });
</script>

<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
	<div class="flex items-center">
		<h2 class="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200 flex-1">
			{isEditing ? 'Edit' : 'Add New'} Post
		</h2>
	</div>
</div>

<div class="grid grid-cols-1 gap-10 md:grid-cols-3">
    <div class="col-span-2">
        <div class="pl-10">
            <Card.Root>
                <Card.Content class="mt-5">
                    <div class="flex items-center space-x-4">
                        <div class="relative">
                            <img
                                src={selectedAuthorImageUrl}
                                width={36}
                                height={36}
                                alt="Author Avatar"
                                class="overflow-hidden rounded-full cursor-pointer"
                                on:click={pickAuthorAvatar}
                            />
                            <input
                                type="file"
                                bind:this={authorImageUpload}
                                on:change={handleAuthorImageUpload}
                                hidden
                                accept="image/png, image/jpeg"
                            />
                        </div>
                        <div class="flex-grow">
                            <Label for="author">Author</Label>
                            <Input
                                id="author"
                                type="text"
                                class="w-full"
                                placeholder="Author"
                                bind:value={authorName}
                            />
                        </div>
                        <div class="flex-grow">
                            <Label for="dsignation">Designation</Label>
                            <Input
                                id="dsignation"
                                type="text"
                                class="w-full"
                                placeholder="Author"
                                bind:value={autherDesignation}
                            />
                        </div>
                    </div>
                </Card.Content>
            </Card.Root>
        </div>
        <div class="pl-10">
            <Card.Root class="mt-5">
                <Card.Content class="mt-5">
                  <div class="grid gap-6">
                    <div class="grid gap-3">
                      <Label for="title">Title</Label>
                      <Input
                        id="title"
                        type="text"
                        class="w-full"
                        placeholder="title"
                        bind:value={title}
                      />
                    </div>
                    <div class="grid gap-3">
                      <Label for="permalink">Permalink</Label>
                      <Input
                        id="permalink"
                        type="text"
                        class="w-full"
                        placeholder="Permalink"
                        bind:value={permalink}
                      />
                    </div>
                    <div class="grid gap-3">
                      <Label for="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="description"
                        bind:value={description}
                        class="min-h-32"
                      />
                    </div>
                  </div>
                </Card.Content>
              </Card.Root>
        </div>
    </div>
    <div class="mr-10">
        <div>
            <Card.Root>
                <Card.Content class="mt-5">
                  <div class="grid gap-6">
                    <Button on:click={createOrUpdateBlog}>
                        {isEditing ? 'Update' : 'Create'} Blog
                    </Button>
                    <select id="status" class="w-64" bind:value={selectedStatus}>
                        <option value="" disabled selected>Select status</option>
                        {#each status as status}
                          <option value={status.value}>{status.label}</option>
                        {/each}
                    </select>
                    <select id="priority" class="w-64" bind:value={selectedPriority}>
                        <option value="" disabled selected>Select Priority</option>
                        {#each priority as priority}
                          <option value={priority.value}>{priority.label}</option>
                        {/each}
                    </select>
                  </div>
                </Card.Content>
              </Card.Root>
        </div>
        <div>
            <Card.Root class="mt-5">
                <Card.Content class="mt-5">
                  <div class="grid gap-6">
                      <div class="flex justify-center gap-3">
                        <img 
                            src={selectedImageUrl}
                            alt="Selected"
                        />
                      </div>
                      <div class="grid gap-2">
                        <Button
                          id="area"
                          variant="outline"
                          on:click={pickAvatar}>
                          {isEditing ? 'Change Image' : 'Upload Image'}
                        </Button>
                        {#if isEditing}
                            <p class="text-sm text-gray-500">Current image will be used if no new image is selected.</p>
                        {/if}
                        <input
                          type="file"
                          id="file-input"
                          bind:this={imageUpload}
                          on:change={handleImageUpload}
                          hidden
                          multiple
                          accept="image/png, image/jpeg"
                        />
                      </div>
                  </div>
                </Card.Content>
              </Card.Root>
        </div>
    </div>
</div>