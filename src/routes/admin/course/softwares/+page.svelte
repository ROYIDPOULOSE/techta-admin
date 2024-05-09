<script lang="ts">
	import { Button } from '$lib/components/ui/button';
    import AddSodtware from '$lib/components/addSoftware/+page.svelte'
    import SoftwareTable from './softwareTable.svelte';
    import { db } from '$lib/services/firebase';
    import { onSnapshot, collection, Timestamp } from 'firebase/firestore';
    interface SoftwareData {
        id: string;
        software_name: string;
        duration: string;
        imageUrl: string;
        lastUpdated: Timestamp;
    }

    let showDialog: boolean = false;
    let software: SoftwareData[] = [];
    let editingSoftware: SoftwareData | null = null;

    const unsubscribe = onSnapshot(collection(db, 'software'), (snapshot) => {
        software = snapshot.docs.map((doc) => {
            const data = doc.data();
            const lastUpdated = data.lastUpdated
                ? new Timestamp(data.lastUpdated.seconds, data.lastUpdated.nanoseconds)
                : null;
            return {
                id: doc.id,
                ...data,
                lastUpdated, // Use the created Timestamp object
            } as SoftwareData;
        });
    });
    
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
	<div class="table-container">
        <SoftwareTable softwares={software} on:edit={handleEditSoftware} />
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

<style>
    .table-container {
      width: 100%;
      height: calc(100vh - 64px); /* Subtract the height of any fixed header or navigation */
      overflow: auto;
      padding: 2rem;
    }
</style>