<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { Select } from '$lib/components/ui/select';
    import { onSnapshot, collection, Timestamp } from 'firebase/firestore';
    import { db } from '$lib/services/firebase';
    import StudentTable from "./studentTable.svelte";
    import CreateStudentDetails from '$lib/components/createStudentDetails/+page.svelte'

    interface StudentData {
        id: string;
        name: string;
        address: string;
        phone: string;
        status: string;
        course: string;
        lastUpdated: Timestamp;
    }

    let showDialog: boolean = false;
    let student: StudentData[] = [];
    let editingStudent: StudentData | null = null;

    function toggleForm(student: StudentData | null = null) {
        editingStudent = student;
        showDialog = true;
    }

    function closeDialog(){
        showDialog = false
        editingStudent = null;
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
				Add Student
			</Button>
		</div>
	</div>
    <div class="p-4">
        <StudentTable/>
    </div>
</div>

<div class="abc">
    {#if showDialog}
        <CreateStudentDetails
            open={showDialog}
            on:close={closeDialog}
            editingStudent={editingStudent}
            />
    {/if}
</div>