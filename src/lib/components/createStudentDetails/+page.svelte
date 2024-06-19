<script lang="ts">
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { createEventDispatcher } from "svelte";
    import {
      collection,
      addDoc,
      doc,
      updateDoc,
      Timestamp,
      serverTimestamp,
      getDocs,
    } from "firebase/firestore";
    import { db, storage } from "$lib/services/firebase";
    import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
  
    const dispatch = createEventDispatcher();
    export let open: boolean = false;
    export let editingStudent: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      status: string;
      courseStatus: string;
      courses: string[];
    } | null = null;
  
    let firstName: string = editingStudent?.firstName || "";
    let lastName: string = editingStudent?.lastName || "";
    let email: string = editingStudent?.email || "";
    let phone: string = editingStudent?.phone || "";
    let status: string = editingStudent?.status || "";
    let courseStatus: string = editingStudent?.courseStatus || "";
    let courses: { id: string; course: string }[] = [];
    let selectedCourses: string[] = editingStudent?.courses || [];
    let studentImageUpload: HTMLInputElement;
    let selectedStudentImageUrl = "/favicon.png";

    const statusOptions = [
      { value: "Active", label: "Active" },
      { value: "Graduate", label: "Graduate" },
    ];

    const courseStatusOptions = [
      { value: "Ongoing", label: "Ongoing" },
      { value: "Completed", label: "Completed" },
    ];
  
    async function loadCourses() {
      const coursesCollection = collection(db, "courses");
      const coursesSnapshot = await getDocs(coursesCollection);
      courses = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        course: doc.data().course_name,
      }));
    }
  
    loadCourses();
  
    async function saveStudent() {
      let studentImageUrl = selectedStudentImageUrl;

      if (studentImageUpload && studentImageUpload.files && studentImageUpload.files.length > 0) {
        const file = studentImageUpload.files[0];
        const storageRef = ref(storage, 'student_images/' + file.name);

        try {
          await uploadBytes(storageRef, file);
          studentImageUrl = await getDownloadURL(storageRef);
        } catch (error) {
          console.error("Error uploading student image: ", error);
          alert("An error occurred while uploading the student image.");
          return;
        }
      }

      const studentData = {
        firstName,
        lastName,
        email,
        phone,
        status,
        courseStatus,
        courses: selectedCourses,
        studentImageUrl,
        lastUpdated: serverTimestamp() as Timestamp,
      };
  
      try {
        if (editingStudent) {
          const studentDocRef = doc(db, "students", editingStudent.id);
          await updateDoc(studentDocRef, {
            ...studentData,
            lastUpdated: serverTimestamp(),
          });
          dispatch("update", { ...editingStudent, ...studentData });
        } else {
          const studentsRef = collection(db, "students");
          const docRef = await addDoc(studentsRef, studentData);
          const newStudent = { id: docRef.id, ...studentData };
          dispatch("update", newStudent);
        }
  
        closeDialog();
      } catch (error) {
        console.error("Error updating/adding student: ", error);
      }
    }
  
    function closeDialog() {
      dispatch("close");
        firstName = "";
        lastName = "";
        email = "";
        phone = "";
        status = "";
        courseStatus = "";
        selectedCourses = [];
    }

    function pickAuthorAvatar() {
        studentImageUpload.click();
    }

    function handlestudentImageUpload(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            selectedStudentImageUrl = URL.createObjectURL(file);
        }
    }
  </script>
  
  <Dialog.Root open={open} onOpenChange={closeDialog}>
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>Student Details</Dialog.Title>
        <Dialog.Description>Create a new student here.</Dialog.Description>
      </Dialog.Header>
      <form on:submit|preventDefault={saveStudent}>
        <div class="relative">
          <img
              src={selectedStudentImageUrl}
              width={50}
              height={50}
              alt="AuthorAvatar"
              class="overflow-hidden rounded-full cursor-pointer"
              on:click={pickAuthorAvatar}
          />
          <input
              type="file"
              hidden
              bind:this={studentImageUpload}
              on:change={handlestudentImageUpload}
              accept="image/png, image/jpeg"
          />
      </div>
        <div class="grid grid-cols-2 gap-3 pb-2">
          <div>
            <Label for="name">First Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              bind:value={firstName}
            />
          </div>
          <div>
            <Label for="name">Last Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              bind:value={lastName}
            />
          </div>
          <div>
            <Label for="email">E-mail</Label>
            <Input
              id="email"
              placeholder="student@demo.com"
              bind:value={email}
            />
          </div>
          <div>
            <Label for="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="+91 00000 00000"
              bind:value={phone}
            />
          </div>
          <div>
            <Label for="status" class="flex">Status</Label>
            <select id="status" bind:value={status} required>
              <option value="">Select a status</option>
              {#each statusOptions as option}
                <option value={option.value}>{option.label}</option>
              {/each}
            </select>
          </div>
          <div>
            <Label for="courseStatus">Course Status</Label>
            <select id="courseStatus" bind:value={courseStatus} required>
              <option value="">Select a course status</option>
              {#each courseStatusOptions as option}
                <option value={option.value}>{option.label}</option>
              {/each}
            </select>
          </div>
          <div>
            <Label for="courses">Courses</Label>
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
        </div>
        <Dialog.Footer>
          <Button variant="ghost" on:click={closeDialog}>Cancel</Button>
          <Button type="submit">Save changes</Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  </Dialog.Root>