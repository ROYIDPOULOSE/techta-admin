<script lang="ts">
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { createEventDispatcher } from 'svelte';
    import { collection, addDoc, doc, updateDoc, Timestamp, FieldValue, serverTimestamp } from "firebase/firestore";
    import { db } from "$lib/services/firebase";
    import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

    const dispatch = createEventDispatcher();
    export let open:boolean = false;
    export let editingCourse: { 
      id: string; 
      course_name: string; 
      software: string; 
      duration: number;
      course_discription: string;
      delivery_mode: string;
      schedule: string;
      prerequisites: string;
      curriculum: string;
      course_fee: string;
    } | null = null;

    
    interface CourseData {
      [key: string]: any; // Index signature to allow dynamic property access
      id?: string;
      course_name: string;
      software: string;
      duration: number;
      course_discription: string;
      delivery_mode: string;
      schedule: string;
      prerequisites: string;
      curriculum: string;
      course_fee: string;
      courseImageUrl?: string | null;
      lastUpdated: Timestamp | FieldValue;
    }
    
    let courseInput: string = editingCourse?.course_name || '';
    let softwareInput: string = editingCourse?.software || '';
    let durationInput: number = editingCourse?.duration || 0;
    let discriptionInput: string = editingCourse?.course_discription || '';
    let deliveryInput: string = editingCourse?.delivery_mode || '';
    let scheduleInput: string = editingCourse?.schedule || '';
    let prerequisitesInput: string = editingCourse?.prerequisites || '';
    let curriculumInput: string = editingCourse?.curriculum || '';
    let course_feeInput: string = editingCourse?.course_fee || '';
    let courseImageInput: File | null = null;

    const storage = getStorage();

    async function handleImageUpload(event: Event) {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        courseImageInput = target.files[0];
      }
    }
  
    async function saveCourse() {
      const courseData: CourseData = {
        course_name: courseInput,
        software: softwareInput,
        duration: durationInput,
        course_discription: discriptionInput,
        delivery_mode: deliveryInput,
        schedule: scheduleInput,
        prerequisites: prerequisitesInput,
        curriculum: curriculumInput,
        course_fee: course_feeInput,
        lastUpdated: serverTimestamp(),
      };
      
      try {
        let courseImageUrl: string | null = null;

        if (courseImageInput) {
          const storageRef = ref(storage, `course_images/${courseImageInput.name}`);
          const uploadTask = uploadBytesResumable(storageRef, courseImageInput);

          courseImageUrl = await new Promise((resolve, reject) => {
            uploadTask.on(
              'state_changed',
              (snapshot) => {
                // Handle progress if needed
              },
              (error) => {
                console.error('Error uploading image:', error);
                reject(error);
              },
              async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                resolve(url);
              }
            );
          });
          courseData.courseImageUrl = courseImageUrl;
        }

        if (editingCourse) {
          const courseDocRef = doc(db, 'courses', editingCourse.id);
          await updateDoc(courseDocRef, { ...courseData, lastUpdated: serverTimestamp() } );
          dispatch('update', { ...editingCourse, ...courseData });
        } else {
          const courseRef = collection(db, 'courses');
          const docRef = await addDoc(courseRef, courseData);
          const newCourse = { id: docRef.id, ...courseData };
          dispatch('update', newCourse);
        }
      } catch (error) {
        console.error("Error updating/adding course: ", error);
      }finally {
        courseInput = "";
        softwareInput = "";
        durationInput = 0;
        courseImageInput = null;
        closeDialog(); 
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
  <Dialog.Content class="sm:max-w-[1200px] p-8">
    <Dialog.Header>
      <Dialog.Title>Course Details</Dialog.Title>
      <Dialog.Description> create a new course here. </Dialog.Description>
    </Dialog.Header>
    <form on:submit|preventDefault={saveCourse}>
      <div class="grid grid-cols-4 gap-4 py-4">
        <div class="grid gap-2">
          <Label for="course">Course</Label>
          <Input id="course" class="w-64" placeholder="2D Drafting and Ploting" bind:value={courseInput} />
        </div>
        <div class="grid gap-2">
          <Label for="software">Software</Label>
          <Input id="software" class="w-64" placeholder="Auto CAD" bind:value={softwareInput} />
        </div>
        <div class="grid gap-2">
          <Label for="duration">Duration</Label>
          <Input id="duration" class="w-64" type="number" placeholder="60" bind:value={durationInput} />
        </div>
        <div class="grid gap-2">
          <Label for="course_description">Course Description</Label>
          <Input id="course_description" class="w-64" placeholder="Enter course description" bind:value={discriptionInput} />
        </div>
        <div class="grid gap-2">
          <Label for="delivery_mode">Delivery Mode</Label>
          <Input id="delivery_mode" class="w-64" placeholder="Online/In-person" bind:value={deliveryInput} />
        </div>
        <div class="grid gap-2">
          <Label for="schedule">Schedule</Label>
          <Input id="schedule" class="w-64" placeholder="Enter schedule" bind:value={scheduleInput} />
        </div>
        <div class="grid gap-2">
          <Label for="prerequisites">Prerequisites</Label>
          <Input id="prerequisites" class="w-64" placeholder="Enter prerequisites" bind:value={prerequisitesInput} />
        </div>
        <div class="grid gap-2">
          <Label for="curriculum">Curriculum</Label>
          <Input id="curriculum" class="w-64" placeholder="Enter curriculum" bind:value={curriculumInput} />
        </div>
        <div class="grid gap-2">
          <Label for="course_fee">Course Fee</Label>
          <Input id="course_fee" class="w-64" placeholder="Enter course fee" bind:value={course_feeInput} />
        </div>
        <div class="grid gap-2">
          <Label for="course_image">Course Image</Label>
          <Input
            id="course_image"
            class="w-64"
            type="file"
            accept="image/*"
            on:change={handleImageUpload}
          />
        </div>
      </div>
      <Dialog.Footer>
        <Button variant="ghost" on:click={closeDialog}>Cancel</Button>
        <Button type="submit">Save changes</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>