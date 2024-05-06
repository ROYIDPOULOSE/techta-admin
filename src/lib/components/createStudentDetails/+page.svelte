<script lang="ts">
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { createEventDispatcher } from "svelte";
    import {
      getFirestore,
      collection,
      addDoc,
      doc,
      updateDoc,
      Timestamp,
      serverTimestamp,
      getDocs,
    } from "firebase/firestore";
    import { app, db } from "$lib/services/firebase";
  
    const dispatch = createEventDispatcher();
    export let open: boolean = false;
    export let editingStudent: {
      id: string;
      name: string;
      address: string;
      phone: string;
      status: string;
      course: string;
    } | null = null;
  
    let name: string = editingStudent?.name || "";
    let address: string = editingStudent?.address || "";
    let phone: string = editingStudent?.phone || "";
    let status: string = editingStudent?.status || "";
    let course: string = editingStudent?.course || "";
  
    let courses: { id: string; course: string }[] = [];
  
    async function loadCourses() {
      const coursesCollection = collection(db, "courses");
      const coursesSnapshot = await getDocs(coursesCollection);
      courses = coursesSnapshot.docs.map((doc) => ({
        id: doc.id,
        course: doc.data().course,
      }));
    }
  
    loadCourses();
  
    async function saveStudent() {
      const studentData = {
        name,
        address,
        phone,
        status,
        course,
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
  
        name = "";
        address = "";
        phone = "";
        status = "";
        course = "";
      } catch (error) {
        console.error("Error updating/adding student: ", error);
      }
    }
  
    function closeDialog() {
      dispatch("close");
      name = "";
      address = "";
      phone = "";
      status = "";
      course = "";
    }
  </script>
  
  <Dialog.Root open={open} onOpenChange={closeDialog}>
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>Student Details</Dialog.Title>
        <Dialog.Description>Create a new student here.</Dialog.Description>
      </Dialog.Header>
      <form on:submit|preventDefault={saveStudent}>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="name" class="text-right">Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              class="col-span-3"
              bind:value={name}
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="address" class="text-right">Address</Label>
            <Input
              id="address"
              placeholder="123 Main St."
              class="col-span-3"
              bind:value={address}
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="phone" class="text-right">Phone</Label>
            <Input
              id="phone"
              placeholder="555-1234"
              class="col-span-3"
              bind:value={phone}
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="status" class="text-right">Status</Label>
            <Input
              id="status"
              placeholder="Active"
              class="col-span-3"
              bind:value={status}
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="course" class="text-right">Course</Label>
            <select
              id="course"
              class="col-span-3"
              bind:value={course}
              required
            >
              <option value="">Select a course</option>
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