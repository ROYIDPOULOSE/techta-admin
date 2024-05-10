<script lang="ts">
	import * as Card from '$lib/components/ui/card';
    import { Button } from '$lib/components/ui/button';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
    import { getDoc, deleteDoc, doc } from 'firebase/firestore';
    import { db } from '$lib/services/firebase';
    import { createEventDispatcher } from 'svelte';
    import { getStorage, ref, deleteObject } from 'firebase/storage';

    const storage = getStorage();

    export let course: { 
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
     };

    const dispatch = createEventDispatcher();

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
</script>

<Card.Root>
    <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
      <Card.Title class="text-sm font-bold">{course.course_name}</Card.Title>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="ghost" size="sm">
            <span>&#8230;</span>
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
    </Card.Header>
    <Card.Content>
      <p class="text-xs text-muted-foreground">{course.software}</p>
      <p class="text-xs text-muted-foreground">{course.duration} hours</p>
    </Card.Content>
</Card.Root>