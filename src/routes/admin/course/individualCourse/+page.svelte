<script lang="ts">
	import { Button } from '$lib/components/ui/button';
    import AddCourse from '$lib/components/addCourse/+page.svelte';
    import CourseCard from '$lib/components/courseCard/+page.svelte'
    import { onSnapshot, collection } from 'firebase/firestore';
    import { db } from '$lib/services/firebase';

    interface CourseData {
        id: string;
        course: string;
        software: string;
        duration: number;
    }

    let showDialog: boolean = false;
    let courses: CourseData[] = [];

    // Fetch courses from Firestore
    const unsubscribe = onSnapshot(collection(db, 'courses'), (snapshot) => {
        courses = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CourseData));
    });

    function toggleForm() {
        showDialog = !showDialog;
    }

    function closeDialog(){
        showDialog = false
    }
</script>

<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
	<div class="flex items-center">
		<h2 class="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200 flex-1">
			Individual Course
		</h2>
		<div class="glow-border mr-4">
			<Button variant="outline" 
            class="text-xs flex items-center gap-2 border  px-4 py-1.5"
            on:click={() => toggleForm()}>
				Add Course
			</Button>
		</div>
	</div>
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-4">
        {#each courses as course}
            <CourseCard {course} />
        {/each}
    </div>
</div>

<div class="abc">
    {#if showDialog}
        <AddCourse 
        open={showDialog}
        on:close={closeDialog}/>
    {/if}
</div>

