<script lang="ts">
	import { Button } from '$lib/components/ui/button';
    import AddCourse from '$lib/components/addCourse/+page.svelte';
    import CourseCard from '$lib/components/courseCard/+page.svelte'
    import { onSnapshot, collection, Timestamp, FieldValue } from 'firebase/firestore';
    import { db } from '$lib/services/firebase';
    import type { ModuleData, CourseData } from './types';

    let showDialog: boolean = false;
    let courses: CourseData[] = [];
    let editingCourse: CourseData | null = null;
    let sortOrder: 'lastUpdated' | 'oldestFirst' = 'lastUpdated';

    const unsubscribe = onSnapshot(collection(db, 'courses'), (snapshot) => {
        courses = snapshot.docs.map((doc) => {
            const data = doc.data();
            const lastUpdated = data.lastUpdated ? new Timestamp(data.lastUpdated.seconds, data.lastUpdated.nanoseconds) : null;
            return {
            id: doc.id,
            ...data,
            lastUpdated,
            } as CourseData;
        });
    });

    function toggleForm(course: CourseData | null = null) {
        editingCourse = course;
        showDialog = true;
    }

    function closeDialog(){
        showDialog = false
        editingCourse = null;
    }

    function handleEditCourse(event: CustomEvent<CourseData>) {
        toggleForm(event.detail);
    }

    function handleUpdateCourse(event: CustomEvent<CourseData | {[key: string]: any }>) {
        const updatedCourse = event.detail;
        if (updatedCourse.id) {
            const updatedCourses = courses.map((course): CourseData => {
            if (course.id === updatedCourse.id) {
                return updatedCourse as CourseData;
            }
            return course;
            });
            courses = updatedCourses;
        } else {
            const newCourse: CourseData = updatedCourse as CourseData;
            courses = [...courses, newCourse];
        }
        closeDialog();
    }

    function sortCourses() {
        let sortedCourses = courses.slice();

        if (sortOrder === 'oldestFirst') {
            sortedCourses = sortedCourses.sort((a, b) => {
            const aTime = isTimestamp(a.lastUpdated) ? a.lastUpdated.toDate().getTime() : 0;
            const bTime = isTimestamp(b.lastUpdated) ? b.lastUpdated.toDate().getTime() : 0;
            return aTime - bTime;
            });
        } else {
            sortedCourses = sortedCourses.sort((a, b) => {
            const aTime = isTimestamp(a.lastUpdated) ? a.lastUpdated.toDate().getTime() : 0;
            const bTime = isTimestamp(b.lastUpdated) ? b.lastUpdated.toDate().getTime() : 0;
            return bTime - aTime;
            });
        }

        courses = sortedCourses;
    }

    function isTimestamp(value: Timestamp | FieldValue): value is Timestamp {
        return (value as Timestamp).toDate !== undefined;
    }

    function setSortOrder(order: 'lastUpdated' | 'oldestFirst') {
        sortOrder = order;
        sortCourses();
    }
</script>

<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
	<div class="flex items-center">
		<h2 class="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200 flex-1">
			Professional Course
		</h2>
		<div class="glow-border mr-4">
			<Button variant="outline" 
            class="text-xs flex items-center gap-2 border  px-4 py-1.5"
            on:click={() => toggleForm()}>
				Add Course
			</Button>
		</div>
        <div class="glow-border">
            <select
              class="text-xs border px-4 py-1.5"
              bind:value={sortOrder}
              on:change={() => sortCourses()}>
              <option value="lastUpdated">Sort by Last Updated</option>
              <option value="oldestFirst">Sort by Oldest First</option>
            </select>
        </div>
	</div>
	<div class="grid  md:grid-cols-5 lg:grid-cols-5 p-4">
        {#each courses as course}
            <CourseCard {course} on:edit={handleEditCourse}/>
        {/each}
    </div>
</div>

<div class="abc">
    {#if showDialog}
        <AddCourse
            open={showDialog}
            on:close={closeDialog}
            editingCourse={editingCourse}
            on:update={(event) => {
                handleUpdateCourse(event);
                sortCourses();
            }}
            />
    {/if}
</div>