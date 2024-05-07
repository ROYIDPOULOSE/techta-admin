<script lang="ts">
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { createEventDispatcher } from 'svelte';
    import { getFirestore, collection, addDoc, doc, updateDoc, Timestamp, serverTimestamp } from "firebase/firestore";
    import { app, db } from "$lib/services/firebase";

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
      exam_details: string;
      instructor: string;
      course_fee: string;
      reviews: string;
      faqs: string;
      registration: string;
      contact_information: string
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
      exam_details: string;
      instructor: string;
      course_fee: string;
      reviews: string;
      faqs: string;
      registration: string;
      contact_information: string
      lastUpdated: Timestamp;
    }
    
    let courseInput: string = editingCourse?.course_name || '';
    let softwareInput: string = editingCourse?.software || '';
    let durationInput: number = editingCourse?.duration || 0;
    let discriptionInput: string = editingCourse?.course_discription || '';
    let deliveryInput: string = editingCourse?.delivery_mode || '';
    let scheduleInput: string = editingCourse?.schedule || '';
    let prerequisitesInput: string = editingCourse?.prerequisites || '';
    let curriculumInput: string = editingCourse?.curriculum || '';
    let exam_detailsInput: string = editingCourse?.exam_details || '';
    let instructorInput: string = editingCourse?.instructor || '';
    let course_feeInput: string = editingCourse?.course_fee || '';
    let reviewsInput: string = editingCourse?.reviews || '';
    let faqsInput: string = editingCourse?.faqs || '';
    let registrationInput: string = editingCourse?.registration || '';
    let contact_informationInput: string = editingCourse?.contact_information || '';
  
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
        exam_details: exam_detailsInput,
        instructor: instructorInput,
        course_fee: course_feeInput,
        reviews: reviewsInput,
        faqs: faqsInput,
        registration: registrationInput,
        contact_information: contact_informationInput,
        lastUpdated: serverTimestamp() as Timestamp,
      };
      
      try {
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
          <Label for="exam_details">Exam Details</Label>
          <Input id="exam_details" class="w-64" placeholder="Enter exam details" bind:value={exam_detailsInput} />
        </div>
        <div class="grid gap-2">
          <Label for="instructor">Instructor</Label>
          <Input id="instructor" class="w-64" placeholder="Enter instructor" bind:value={instructorInput} />
        </div>
        <div class="grid gap-2">
          <Label for="course_fee">Course Fee</Label>
          <Input id="course_fee" class="w-64" placeholder="Enter course fee" bind:value={course_feeInput} />
        </div>
        <div class="grid gap-2">
          <Label for="reviews">Reviews</Label>
          <Input id="reviews" class="w-64" placeholder="Enter reviews" bind:value={reviewsInput} />
        </div>
        <div class="grid gap-2">
          <Label for="faqs">FAQs</Label>
          <Input id="faqs" class="w-64" placeholder="Enter FAQs" bind:value={faqsInput} />
        </div>
        <div class="grid gap-2">
          <Label for="registration">Registration</Label>
          <Input id="registration" class="w-64" placeholder="Enter registration details" bind:value={registrationInput} />
        </div>
        <div class="grid gap-2">
          <Label for="contact_information">Contact Information</Label>
          <Input id="contact_information" class="w-64" placeholder="Enter contact information" bind:value={contact_informationInput} />
        </div>
      </div>
      <Dialog.Footer>
        <Button variant="ghost" on:click={closeDialog}>Cancel</Button>
        <Button type="submit">Save changes</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>