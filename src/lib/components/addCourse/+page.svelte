<script lang="ts">
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { createEventDispatcher } from 'svelte';
    import { getFirestore, collection, addDoc } from "firebase/firestore";
    import { app, db } from "$lib/services/firebase";

    const dispatch = createEventDispatcher();
    export let open:boolean = false;

    function closeDialog() {
      dispatch('close');
    }

    interface CourseData {
      course: string;
      software: string;
      duration: number;
    }

    let courseInput: string = "";
    let softwareInput: string = "";
    let durationInput: number = 0;

    async function saveCourse() {
      const courseRef = collection(db, "courses");
      const courseData: CourseData = {
        course: courseInput,
        software: softwareInput,
        duration: durationInput,
      };

      try {
        await addDoc(courseRef, courseData);
        console.log("collectionadded");
        
        // Clear inputs or show success message
        courseInput = "";
        softwareInput = "";
        durationInput = 0;
      } catch (error) {
        console.error("Error adding course: ", error);
      }
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