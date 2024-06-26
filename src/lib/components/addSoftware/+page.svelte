<script lang="ts">
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Button } from "$lib/components/ui/button";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { createEventDispatcher } from "svelte";
    import {
      collection,
      addDoc,
      doc,
      updateDoc,
      Timestamp,
      serverTimestamp,
    } from "firebase/firestore";
    import { db } from "$lib/services/firebase";
    import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
    // import { storage } from '$lib/services/firebase';
  
    const dispatch = createEventDispatcher();
    export let open: boolean = false;
    export let editingSoftware: {
      id: string;
      software_name: string;
      duration: string;
      imageUrl: string;
    } | null = null;
  
    let software_name: string = editingSoftware?.software_name || "";
    let duration: string = editingSoftware?.duration || "";
    let softwareImage: File | null = null;

    const storage = getStorage();

    async function handleImageUpload(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            softwareImage = target.files[0];
        }
    }
  
    async function saveSoftware() {
      const softwareData = {
        software_name,
        duration,
        lastUpdated: serverTimestamp() as Timestamp,
      };
  
      try {
        let imageUrl: string | null = editingSoftware?.imageUrl || null;
        if (softwareImage) {
        const storageRef = ref(storage, `software_images/${softwareImage.name}`);
        const uploadTask = uploadBytesResumable(storageRef, softwareImage);

        imageUrl = await new Promise<string | null>((resolve, reject) => {
            uploadTask.on(
                  'state_changed',
                  (snapshot) => {
                      // Handle progress if needed
                  },
                  (error) => {
                      console.error('Error uploading image:', error);
                      reject(null);
                  },
                  async () => {
                      const url = await getDownloadURL(uploadTask.snapshot.ref);
                      resolve(url);
                  }
                );
            });
        }

        if (editingSoftware) {
          const softwareDocRef = doc(db, "software", editingSoftware.id);
          await updateDoc(softwareDocRef, { ...softwareData, imageUrl, lastUpdated: serverTimestamp() });
          dispatch("update", { ...editingSoftware, ...softwareData, imageUrl });
        } else {
          const softwareRef = collection(db, "software");
          const docRef = await addDoc(softwareRef, { ...softwareData, imageUrl });
          const newSoftware = { id: docRef.id, ...softwareData, imageUrl };
          dispatch("update", newSoftware);
        }
  
        software_name = "";
        duration = "";
        softwareImage = null;
      } catch (error) {
        console.error("Error updating/adding student: ", error);
      }
    }
  
    function closeDialog() {
      dispatch("close");
      software_name = "";
      duration = "";
    }
  </script>
  
  <Dialog.Root open={open} onOpenChange={closeDialog}>
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>Software details</Dialog.Title>
        <Dialog.Description>Create a new software here.</Dialog.Description>
      </Dialog.Header>
      <form on:submit|preventDefault={saveSoftware}>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="software_name" class="text-right">Software name</Label>
            <Input
              id="software_name"
              placeholder="AutoCAD"
              class="col-span-3"
              bind:value={software_name}
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="duration" class="text-right">Duration</Label>
            <Input
              id="duration"
              placeholder="60"
              class="col-span-3"
              bind:value={duration}
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="image" class="text-right">Software Image</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              class="col-span-3"
              on:change={handleImageUpload}
            />
          </div>
        </div>
        <Dialog.Footer class="justify-between">
          <Button variant="ghost" on:click={closeDialog}>Cancel</Button>
          <Button type="submit">Save changes</Button>
        </Dialog.Footer>
      </form>
    </Dialog.Content>
  </Dialog.Root>