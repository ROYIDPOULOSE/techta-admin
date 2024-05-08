<script lang="ts">
	import { Button } from '$lib/components/ui/button';
    import { Timestamp } from 'firebase/firestore';
    import AddSodtware from '$lib/components/addSoftware/+page.svelte'

    interface SoftwareData {
        id: string;
        software_name: string;
        duration: string;
        lastUpdated: Timestamp;
    }

    let showDialog: boolean = false;
    let software: SoftwareData[] = [];
    let editingSoftware: SoftwareData | null = null;
    
    function toggleForm(software: SoftwareData | null = null) {
        editingSoftware = software;
        showDialog = true;
    }
    
    function closeDialog(){
        showDialog = false
        editingSoftware = null;
    }

    function handleEditSoftware(event: CustomEvent<SoftwareData>) {
        toggleForm(event.detail);
    }

    function handleUpdateSoftware(event: CustomEvent<SoftwareData | { [key: string]: any }>) {
        const updatedSoftware = event.detail;
        if (updatedSoftware.id) {
            const updatedSoftwares = software.map((software): SoftwareData => {
                if (software.id === updatedSoftware.id) {
                    return updatedSoftware as SoftwareData; // Type assertion for updatedSoftware
                }
                return software;
            });
            software = updatedSoftwares;
        } else {
            const newSoftware: SoftwareData = updatedSoftware as SoftwareData;
            software = [...software, newSoftware];
        }
        closeDialog();
    }

</script>

<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
	<div class="flex items-center">
		<h2 class="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200 flex-1">
			Software
		</h2>
		<div class="glow-border mr-4">
			<Button variant="outline" 
            class="text-xs flex items-center gap-2 border  px-4 py-1.5"
            on:click={() => toggleForm()}>
				Add Software
			</Button>
		</div>
	</div>
	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-4">
        <!-- {#each courses as course}
            <CourseCard {course} on:edit={handleEditCourse}/>
        {/each} -->
    </div>
</div>

<div class="abc">
    {#if showDialog}
        <AddSodtware
            open={showDialog}
            on:close={closeDialog}
            editingSoftware={editingSoftware}
            on:update={(event) => handleUpdateSoftware(event)}
            />
    {/if}
</div>