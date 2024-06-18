<script lang="ts">
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { createEventDispatcher } from 'svelte';
    import { collection, getDocs, addDoc, doc, updateDoc, Timestamp, FieldValue, serverTimestamp } from "firebase/firestore";
    import { db } from "$lib/services/firebase";
    import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
    import { Textarea } from "$lib/components/ui/textarea";
    import * as Select from "$lib/components/ui/select/index.js";
    import { onMount } from 'svelte';

    const dispatch = createEventDispatcher();
    export let open:boolean = false;
    export let editingCourse: { 
      id: string; 
      course_name: string; 
      software: string[]; 
      duration: number;
      course_description: string;
      delivery_mode: string;
      schedule: string;
      prerequisites: string;
      stream: string;
      modules?: ModuleData[];
      courseType: string;
      ourbest: boolean;
    } | null = null;

    
    interface CourseData {
      [key: string]: any; 
      id?: string;
      course_name: string;
      software: string[];
      duration: number;
      course_description: string;
      delivery_mode: string;
      schedule: string;
      prerequisites: string;
      stream: string;
      courseImageUrl?: string | null;
      lastUpdated: Timestamp | FieldValue;
      modules?: { [key: string]: ModuleData };
      courseType: string;
      ourbest: boolean;
    }

    interface ModuleData {
      moduleName: string;
      description: string;
    }

    const streams = [
      { value: "Civil", label: "Civil" },
      { value: "IT", label: "IT" },
      { value: "Mech", label: "Mech" },
      { value: "Aero", label: "Aero" }
    ];
    
    let courseInput: string = editingCourse?.course_name || '';
    let softwareInput: string[] = editingCourse?.software ?? [];
    let durationInput: number = editingCourse?.duration || 0;
    let descriptionInput: string = editingCourse?.course_description || '';
    let deliveryInput: string = editingCourse?.delivery_mode || '';
    let scheduleInput: string = editingCourse?.schedule || '';
    let prerequisitesInput: string = editingCourse?.prerequisites || '';
    let streamInput: string = editingCourse?.stream || '';
    let courseImageInput: File | null = null;
    let softwares: { id: string; name: string }[] = [];
    let showAddModuleSection = false;
    let modules: ModuleData[] = editingCourse ? (editingCourse.modules || []) : [];
    let courseTypeInput: string = editingCourse?.courseType || '';
    let isOurBest: boolean = editingCourse?.ourbest || false;
    
    const storage = getStorage();

    onMount(async () => {
      const softwareCollection = collection(db, 'software');
      const softwareSnapshot = await getDocs(softwareCollection);
      softwares = softwareSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().software_name,
      }));
    });

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
        course_description: descriptionInput,
        delivery_mode: deliveryInput,
        schedule: scheduleInput,
        prerequisites: prerequisitesInput,
        stream: streamInput,
        lastUpdated: serverTimestamp(),
        courseType: courseTypeInput,
        ourbest: isOurBest,
      };
      
      const moduleData: { [key: string]: ModuleData } = {};

      if (Array.isArray(modules)) {
        modules.forEach((module, index) => {
          const moduleKey = `module${index + 1}`;
          moduleData[moduleKey] = module;
        });
      } else {
        console.error("modules is not an array");
      }

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

        courseData.modules = moduleData;

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
        softwareInput = [];
        durationInput = 0;
        courseImageInput = null;
        closeDialog(); 
      }
    }
    
    function closeDialog() {
      dispatch('close');
      courseInput = '';
      softwareInput = [];
      durationInput = 0;
      modules = [];
    }

    function addModule() {
      modules = [...modules, { moduleName: '', description: '' }];
    }
  </script>

<Dialog.Root open={open} onOpenChange={closeDialog}>
  <Dialog.Content class="sm:max-w-[1200px] p-8">
    <Dialog.Header>
      <div class="flex justify-between">
        <div>
          <Dialog.Title>Course Details</Dialog.Title>
          <Dialog.Description> create a new course here. </Dialog.Description>
        </div>
        <div class="flex justify-end gap-8">
          <div class="grid gap-2">
            <Label for="course_type">Course Type</Label>
            <select id="course_type" class="w-64" bind:value={courseTypeInput}>
              <option value="" disabled selected>Select Course Type</option>
              <option value="professional">Professional</option>
              <option value="interim">Interim</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <Label for="ourbest">Our Best</Label>
            <input id="ourbest" type="checkbox" bind:checked={isOurBest}/>
          </div>
        </div>
      </div>
    </Dialog.Header>
    <div class="max-h-[500px] overflow-y-auto">
      <form on:submit|preventDefault={saveCourse}>
        <div class="grid grid-cols-4 gap-4 pl-2 py-4">
          <div class="grid gap-2">
            <Label for="course">Course</Label>
            <Input id="course" class="w-64" placeholder="2D Drafting and Ploting" bind:value={courseInput} />
          </div>
          <div class="grid gap-2">
            <Label for="software">Software</Label>
            <select
              id="software"
              class="w-64"
              multiple
              bind:value={softwareInput}>
              {#each softwares as software}
                <option value={software.id}>{software.name}</option>
              {/each}
            </select>
          </div>
          <div class="grid gap-2">
            <Label for="duration">Duration</Label>
            <Input id="duration" class="w-64" type="number" placeholder="60" bind:value={durationInput} />
          </div>
          <div class="grid gap-2">
            <Label for="stream">Stream</Label>
            <select id="stream" class="w-64" bind:value={streamInput}>
              <option value="" disabled selected>Select a stream</option>
              {#each streams as stream}
                <option value={stream.value}>{stream.label}</option>
              {/each}
            </select>
          </div>
          <div class="grid gap-2">
            <Label for="course_description">Course Description</Label>
            <Textarea  id="course_description" class="w-64" placeholder="Enter course description" bind:value={descriptionInput} />
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
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center">
            <Label>Add Modules</Label>
            <input type="checkbox" bind:checked={showAddModuleSection} class="ml-2" />
          </div>
        </div>
        {#if showAddModuleSection}
        <div class="grid grid-cols-4 gap-4 py-4 border border-gray-300 rounded-md p-4">
          {#each modules as module, index}
              <div class="grid gap-2 col-span-2">
                <Label for={`moduleName-${index}`}>Module Name</Label>
                <Input id={`moduleName-${index}`} class="w-full" placeholder="Enter Module" bind:value={module.moduleName} />
              </div>
              <div class="grid gap-2 col-span-2">
                <Label for={`description-${index}`}>Description</Label>
                <Textarea id={`description-${index}`} class="w-full" placeholder="Enter module description" bind:value={module.description} />
              </div>
            {/each}
          </div>
          <Button on:click={addModule}>Add Module</Button>
        {/if}
        <Dialog.Footer>
          <Button variant="ghost" on:click={closeDialog}>Cancel</Button>
          <Button type="submit">Save changes</Button>
        </Dialog.Footer>
      </form>
    </div>
  </Dialog.Content>
</Dialog.Root>