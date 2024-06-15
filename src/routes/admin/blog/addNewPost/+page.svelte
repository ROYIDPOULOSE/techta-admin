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
    import { onMount } from 'svelte';

    let imageUpload: HTMLInputElement;
    let selectedImageUrl = "/favicon.png";
    let title = "";
    let permalink = "";
    let description = "";
    let selectedStatus = "";
    let selectedPriority = "";
    let blogId: string | null = null;
    let isEditing = false;

    const status = [
      { value: "Public", label: "public" },
      { value: "Private", label: "private" },
    ];

    const priority = [
      { value: "High", label: "high" },
      { value: "Medium", label: "medium" },
      { value: "Low", label: "low" },
    ];

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

        if (imageUpload.files && imageUpload.files.length > 0) {
            const file = imageUpload.files[0];
            const storageRef = ref(storage, 'blog_images/' + file.name);
            
            try {
                // Upload new image to Firebase Storage
                await uploadBytes(storageRef, file);
                
                // Get the new download URL
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
        
        try {
            const blogData = {
                title,
                permalink,
                description,
                status: selectedStatus,
                priority: selectedPriority,
                imageUrl,
                lastUpdated: new Date()
            };

            if (isEditing && blogId) {
                // Update existing document
                await updateDoc(doc(db, "blogs", blogId), blogData);
                console.log("Blog updated successfully");
            } else {
                // Create a new document
                const docRef = await addDoc(collection(db, "blogs"), {
                    ...blogData,
                    createdAt: new Date()
                });
                console.log("Blog created with ID: ", docRef.id);
            }
            
            alert(isEditing ? "Blog updated successfully!" : "Blog created successfully!");
            
            // Navigate back to the blogs list
            // goto('/blogs');
        } catch (error) {
            console.error("Error creating/updating blog: ", error);
            alert("An error occurred while creating/updating the blog.");
        }
    }

    onMount(async () => {
        blogId = $page.url.searchParams.get('id');
        if (blogId) {
            isEditing = true;
            const blogDoc = await getDoc(doc(db, 'blogs', blogId));
            if (blogDoc.exists()) {
                const blogData = blogDoc.data();
                title = blogData.title;
                permalink = blogData.permalink;
                description = blogData.description;
                selectedStatus = blogData.status;
                selectedPriority = blogData.priority;
                selectedImageUrl = blogData.imageUrl;
            }
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