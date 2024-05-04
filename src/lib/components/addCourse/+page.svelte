<script lang="ts">
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { createEventDispatcher } from 'svelte';
    import { getFirestore, collection, addDoc, doc, updateDoc } from "firebase/firestore";
    import { app, db } from "$lib/services/firebase";

    const dispatch = createEventDispatcher();
    export let open:boolean = false;
    export let editingCourse: { id: string; course: string; software: string; duration: number } | null = null;

    
    interface CourseData {
      [key: string]: any; // Index signature to allow dynamic property access
      id?: string;
      course: string;
      software: string;
      duration: number;
    }
    
    let courseInput: string = editingCourse?.course || '';
    let softwareInput: string = editingCourse?.software || '';
    let durationInput: number = editingCourse?.duration || 0;
    
    async function saveCourse() {
      const courseData: CourseData = {
        course: courseInput,
        software: softwareInput,
        duration: durationInput,
      };
      
      try {
        if (editingCourse) {
          const courseDocRef = doc(db, 'courses', editingCourse.id);
          await updateDoc(courseDocRef, courseData);
          dispatch('update', { ...editingCourse, ...courseData });
        } else {
          const courseRef = collection(db, 'courses');
          const docRef = await addDoc(courseRef, courseData);
          const newCourse = { id: docRef.id, ...courseData };
          dispatch('update', newCourse);
        }
        
        courseInput = "";
        softwareInput = "";
        durationInput = 0;
      } catch (error) {
        console.error("Error updating/adding course: ", error);
      }
    }
    
    function closeDialog() {
      dispatch('close');
      courseInput = '';
      softwareInput = '';
      durationInput = 0;
    }
  </script>

<Dialog.Root open={open} onOpenChange={closeDialog}>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Course Details</Dialog.Title>
      <Dialog.Description> create a new course here. </Dialog.Description>
    </Dialog.Header>
    <form on:submit|preventDefault={saveCourse}>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="course" class="text-right">Course</Label>
          <Input id="course" placeholder="2D Drafting and Ploting" class="col-span-3" bind:value={courseInput} />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="software" class="text-right">Software</Label>
          <Input id="software" placeholder="Auto CAD" class="col-span-3" bind:value={softwareInput} />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="duration" class="text-right">Duration</Label>
          <Input id="duration" type="number" placeholder="60" class="col-span-3" bind:value={durationInput} />
        </div>
      </div>
      <Dialog.Footer>
        <Button variant="ghost" on:click={closeDialog}>Cancel</Button>
        <Button type="submit">Save changes</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>