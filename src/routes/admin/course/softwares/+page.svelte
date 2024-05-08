<script lang="ts">
	import { Button } from '$lib/components/ui/button';

    function toggleForm() {
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
        <!-- {#each courses as course}
            <CourseCard {course} on:edit={handleEditCourse}/>
        {/each} -->
    </div>
</div>