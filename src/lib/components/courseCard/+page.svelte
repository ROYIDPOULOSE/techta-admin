<script lang="ts">
	import * as Card from '$lib/components/ui/card';
    import { Button } from '$lib/components/ui/button';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
    import { deleteDoc, doc } from 'firebase/firestore';
    import { db } from '$lib/services/firebase';

    export let course: { id: string; course: string; software: string; duration: number };

    function handleDelete() {
        const courseDocRef = doc(db, 'courses', course.id);
        deleteDoc(courseDocRef)
        .then(() => {
            console.log('Course deleted successfully');
            // You can add any additional logic here, like showing a success message or updating the UI
        })
        .catch((error) => {
            console.error('Error deleting course: ', error);
            // You can add error handling logic here
        });
    }
</script>

<Card.Root>
    <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
      <Card.Title class="text-sm font-bold">{course.course}</Card.Title>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="ghost" size="sm">
            <span>&#8230;</span>
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>
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