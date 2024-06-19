<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import * as Card from "$lib/components/ui/card/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { goto } from '$app/navigation';
    import { db, storage } from '$lib/services/firebase';
    import { collection, addDoc, doc, getDoc, updateDoc, getDocs } from "firebase/firestore";
    import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
    import { page } from '$app/stores';
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    
    $: hasUnsavedChanges = browser && (firstName !== "" || lastName !== "" || email !== "" || 
    phone !== "" || selectedStatus !== "" || selectedImageUrl !== "/favicon.png");
    
    let studentImageUpload: HTMLInputElement;
    let selectedImageUrl = "/favicon.png";
    let firstName = "";
    let lastName = "";
    let email = "";
    let phone = "";
    let selectedStatus = "";
    let studentId: string | null = null;
    let isEditing = false;

    const statusOptions = [
        { value: "Active", label: "Active" },
        { value: "Graduate", label: "Graduate" },
    ];

    let courses: { id: string; course: string }[] = [];
    let selectedCourses: string[] = [];

    async function loadCourses() {
        const coursesCollection = collection(db, "courses");
        const coursesSnapshot = await getDocs(coursesCollection);
        courses = coursesSnapshot.docs.map((doc) => ({
            id: doc.id,
            course: doc.data().course_name,
        }));
    }

    loadCourses();

    function pickAvatar() {
        studentImageUpload.click();
    }

    function handleImageUpload(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            selectedImageUrl = URL.createObjectURL(file);
            if (isEditing) {
                alert("New image selected. Don't forget to click 'Update Student' to save changes.");
            }
        }
    }

    async function createOrUpdateStudent() {
        let imageUrl = selectedImageUrl;

        if (browser && studentImageUpload && studentImageUpload.files && studentImageUpload.files.length > 0) {
            const file = studentImageUpload.files[0];
            const storageRef = ref(storage, 'student_images/' + file.name);
            
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
        
        try {
            const studentData = {
                firstName,
                lastName,
                email,
                phone,
                status: selectedStatus,
                courses: selectedCourses,
                imageUrl,
                lastUpdated: new Date()
            };

            if (isEditing && studentId) {
                await updateDoc(doc(db, "students", studentId), studentData);
                console.log("Student updated successfully");
            } else {
                const docRef = await addDoc(collection(db, "students"), {
                    ...studentData,
                    createdAt: new Date()
                });
                console.log("Student created with ID: ", docRef.id);
            }
            
            alert(isEditing ? "Student updated successfully!" : "Student created successfully!");

            resetForm();
            
            goto('/admin/dashboard/students');
        } catch (error) {
            console.error("Error creating/updating student: ", error);
            alert("An error occurred while creating/updating the student.");
        }
    }

    function resetForm() {
        firstName = "";
        lastName = "";
        email = "";
        phone = "";
        selectedStatus = "";
        selectedImageUrl = "/favicon.png";
        selectedCourses = [];
        studentId = null;
        isEditing = false;
        if (browser && studentImageUpload) {
            studentImageUpload.value = "";
        }
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
                
                studentId = $page.url.searchParams.get('id');
                if (studentId) {
                    isEditing = true;
                    try{
                        const studentDoc = await getDoc(doc(db, 'students', studentId));
                        if (studentDoc.exists()) {
                            const studentData = studentDoc.data();
                            firstName = studentData.firstName;
                            lastName = studentData.lastName;
                            email = studentData.email;
                            phone = studentData.phone;
                            selectedStatus = studentData.status;
                            selectedImageUrl = studentData.imageUrl;
                            selectedCourses = studentData.courses;
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
			{isEditing ? 'Edit' : 'Add New'} Student
		</h2>
	</div>
</div>

<div class="grid grid-cols-1 gap-10 md:grid-cols-3">
    <div class="col-span-2">
        <div class="pl-10">
            <Card.Root>
                <Card.Content class="mt-5">
                    <div class="grid grid-cols-3">
                        <div class="relative flex justify-center">
                            <img
                                src={selectedImageUrl}
                                width={120}
                                height={120}
                                alt="Author Avatar"
                                class="overflow-hidden rounded-full cursor-pointer"
                                on:click={pickAvatar}
                            />
                            <input
                                type="file"
                                bind:this={studentImageUpload}
                                on:change={handleImageUpload}
                                hidden
                                accept="image/png, image/jpeg"
                            />
                        </div>
                        <div class="grid grid-cols-2 col-span-2 gap-2">
                            <div>
                                <Label for="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    class="w-full"
                                    placeholder="John"
                                    bind:value={firstName}
                                />
                            </div>
                            <div>
                                <Label for="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    class="w-full"
                                    placeholder="Doe"
                                    bind:value={lastName}
                                />
                            </div>
                            <div>
                                <Label for="email">E-mail</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    class="w-full"
                                    placeholder="johndoe@gmail.com"
                                    bind:value={email}
                                />
                            </div>
                            <div>
                                <Label for="lastName">Phone</Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    class="w-full"
                                    placeholder="+91 00000 00000"
                                    bind:value={phone}
                                />
                            </div>
                        </div>
                    </div>
                </Card.Content>
            </Card.Root>
        </div>
        <div class="pl-10">
            <Card.Root class="mt-5">
                <Card.Content class="mt-5">
                  <div class="grid grid-cols-2 gap-6">
                    <div class="grid gap-3">
                      <Label for="courses">Select course</Label>
                      <select
                        id="courses"
                        class="text-wrap"
                        multiple
                        bind:value={selectedCourses}
                        required>
                        {#each courses as course}
                          <option value={course.id}>{course.course}</option>
                        {/each}
                      </select>
                    </div>
                    <div class="grid gap-3">
                      <Label for="status">Status</Label>
                      <select id="status" bind:value={selectedStatus} required>
                        <option value="">Select a status</option>
                        {#each statusOptions as option}
                          <option value={option.value}>{option.label}</option>
                        {/each}
                      </select>
                    </div>
                  </div>
                </Card.Content>
              </Card.Root>
        </div>
    </div>
    <div class="mr-10">
            <Card.Root>
                <Card.Content class="mt-5">
                  <div class="grid gap-6">
                    <Button on:click={createOrUpdateStudent}>
                        {isEditing ? 'Update' : 'Create'} Student
                    </Button>
                    <select id="status" bind:value={selectedStatus} required>
                        <option value="">Select a status</option>
                        {#each statusOptions as option}
                          <option value={option.value}>{option.label}</option>
                        {/each}
                    </select>
                  </div>
                </Card.Content>
              </Card.Root>
    </div>
</div>