<script lang="ts">
	import * as Card from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { getDoc, deleteDoc, doc } from 'firebase/firestore';
  import { db } from '$lib/services/firebase';
  import { createEventDispatcher } from 'svelte';
  import { getStorage, ref, deleteObject } from 'firebase/storage';
  import { getFirestore, collection, getDocs } from "firebase/firestore";
  import { onMount } from 'svelte';
  import { Ellipsis } from 'lucide-svelte';

    const storage = getStorage();
    let isExpanded = false;
    let softwareData: { name: string; imageUrl: string }[] = [];

    export let course: { 
      id: string; 
      course_name: string; 
      software: string[]; 
      duration: number;
      course_discription: string;
      delivery_mode: string;
      schedule: string;
      prerequisites: string;
      courseImageUrl: string;
     };

    const dispatch = createEventDispatcher();

    async function fetchSoftwareData(softwareIds: string[]) {
      const db = getFirestore();
      const softwareCollection = collection(db, "software");
      const softwareData = [];

      try {
        for (const softwareId of softwareIds) {
          const softwareDocRef = doc(softwareCollection, softwareId);
          const softwareDocSnapshot = await getDoc(softwareDocRef);

          if (softwareDocSnapshot.exists()) {
            const softwareDoc = softwareDocSnapshot.data();
            softwareData.push({
              name: softwareDoc.software_name,
              imageUrl: softwareDoc.imageUrl,
            });
          } else {
            console.log(`Software document with ID ${softwareId} does not exist.`);
          }
        }
        return softwareData;
      } catch (error) {
        console.error("Error fetching software data:", error);
        return [];
      }
    }

    function handleDelete() {
      const courseDocRef = doc(db, 'courses', course.id);

        getDoc(courseDocRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const courseData = docSnapshot.data();
              const imageUrl = courseData.courseImageUrl;

              deleteDoc(courseDocRef)
                .then(() => {
                  console.log('Course deleted successfully');

                  if (imageUrl) {
                    const imageRef = ref(storage, imageUrl);
                    deleteObject(imageRef)
                      .then(() => {
                        console.log('Image deleted successfully');
                      })
                      .catch((error) => {
                        console.error('Error deleting image: ', error);
                      });
                  }
                })
                .catch((error) => {
                  console.error('Error deleting course: ', error);
                });
            } else {
              console.log('No such document');
            }
          })
          .catch((error) => {
            console.error('Error getting document: ', error);
        });
    }

    function handleEdit() {
        dispatch('edit', course);
    }

    function toggleExpand() {
      isExpanded = !isExpanded;
    }

    onMount(async () => {
      softwareData = await fetchSoftwareData(course.software);
    });

</script>

  <Card.Root class="w-60 rounded-lg shadow-md overflow-hidden transition-transform duration-300 transform-gpu hover:scale-105 hover:shadow-2xl">
      <div class="relative">
        <img src={course.courseImageUrl} alt="Header Image" class="w-full h-24 object-cover" />
        <div class="absolute top-2 right-2">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button variant="ghost" size="sm" class="bg-white bg-opacity-30 rounded-full p-0">
                  <Ellipsis />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item on:click={handleEdit}>
                <span>Edit</span>
              </DropdownMenu.Item>
              <DropdownMenu.Item on:click={handleDelete}>
                <span>Delete</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>
    
      <Card.Content class="p-3">
        <h2 class="text-base font-bold mb-1 leading-tight">{course.course_name}</h2>
        <p class="text-gray-600 mb-3 text-xs leading-tight overflow-hidden {isExpanded ? 'line-clamp-none' : 'line-clamp-2'}"
        on:click={toggleExpand}>
          {course.course_discription}
          {#if !isExpanded}
            <span>
              ...
              <!-- <span class="text-gray-600 cursor-pointer" aria-label="Show more" on:click={toggleExpand}>more</span> -->
            </span>
          {/if}
        </p>
        <div class="inline-flex flex-wrap space-x-reverse space-x-1">
          {#each softwareData as software}
          <div class="flex items-center">
            <img src="{software.imageUrl}" alt="{software.name}" class="w-6 h-6 rounded-full mr-2" />
            <span class="text-xs font-semibold">{course.software}</span>
          </div>
          {/each}
        </div>
      </Card.Content>

      <Card.Footer class="p-3 flex justify-between items-center">
          <div>
              <p class="font-semibold text-sm">{course.duration} minutes</p>
          </div>
          <div>
              <p class="font-semibold text-sm">₹2,000</p>
          </div>
      </Card.Footer>
  </Card.Root>

  <style>
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      position: relative;
    }

    .line-clamp-2:hover {
      cursor: pointer;
    }

    .line-clamp-none {
      -webkit-line-clamp: unset;
    }
  </style>