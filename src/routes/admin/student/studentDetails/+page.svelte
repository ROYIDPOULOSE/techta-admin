<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { Select } from '$lib/components/ui/select';
    import { onSnapshot, collection, Timestamp } from 'firebase/firestore';
    import { db } from '$lib/services/firebase';
    import StudentTable from "./studentTable.svelte";
    import CreateStudentDetails from '$lib/components/createStudentDetails/+page.svelte'
    import type { StudentData } from './types';

    let showDialog: boolean = false;
    let students: StudentData[] = [];
    let editingStudent: StudentData | null = null;

    const unsubscribe = onSnapshot(collection(db, 'students'), (snapshot) => {
        students = snapshot.docs.map((doc) => {
            const data = doc.data();
            const lastUpdated = data.lastUpdated
                ? new Timestamp(data.lastUpdated.seconds, data.lastUpdated.nanoseconds)
                : null;
            return {
                id: doc.id,
                ...data,
                lastUpdated, // Use the created Timestamp object
            } as StudentData;
        });
    });

    function toggleForm(student: StudentData | null = null) {
        editingStudent = student;
        showDialog = true;
    }

    function closeDialog(){
        showDialog = false
        editingStudent = null;
    }

    function handleEditStudent(event: CustomEvent<StudentData>) {
        toggleForm(event.detail);
    }

    function handleUpdateStudent(event: CustomEvent<StudentData | { [key: string]: any }>) {
        const updatedStudent = event.detail;
        if (updatedStudent.id) {
            const updatedStudents = students.map((student): StudentData => {
                if (student.id === updatedStudent.id) {
                    return updatedStudent as StudentData; // Type assertion for updatedStudent
                }
                return student;
            });
            students = updatedStudents;
        } else {
            const newStudent: StudentData = updatedStudent as StudentData;
            students = [...students, newStudent];
        }
        closeDialog();
    }
</script>

<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
	<div class="flex items-center">
		<h2 class="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200 flex-1">
			Student Details
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
        <StudentTable {students} on:edit={handleEditStudent}/>
    </div>
</div>

<div class="abc">
    {#if showDialog}
        <CreateStudentDetails
            open={showDialog}
            on:close={closeDialog}
            editingStudent={editingStudent}
            on:update={(event) => handleUpdateStudent(event)}
            />
    {/if}
</div>