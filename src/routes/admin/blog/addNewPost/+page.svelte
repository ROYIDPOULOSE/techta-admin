<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import * as Card from "$lib/components/ui/card/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Textarea } from "$lib/components/ui/textarea/index.js";
    import { goto } from '$app/navigation';

</script>

<div class="m-3 bg-background text-foreground rounded-md p-4 px-6 border">
	<div class="flex items-center">
		<h2 class="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200 flex-1">
			Add New Post
		</h2>
	</div>
</div>

<div class="grid grid-cols-1 gap-10 md:grid-cols-3">
    <div class="col-span-2">
        <div class="pl-10">
            <Card.Root>
                <Card.Content class="mt-5">
                  <div class="grid gap-6">
                    <div class="grid gap-3">
                      <Label for="name">Title</Label>
                      <Input
                        id="name"
                        type="text"
                        class="w-full"
                        placeholder=""
                        value="add title"
                      />
                    </div>
                    <div class="grid gap-3">
                      <Label for="name">Permalink</Label>
                      <Input
                        id="name"
                        type="text"
                        class="w-full"
                        placeholder="Permalink"
                        value="Permalink"
                      />
                    </div>
                    <div class="grid gap-3">
                      <Label for="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="description"
                        value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc."
                        class="min-h-32"
                      />
                    </div>
                  </div>
                </Card.Content>
              </Card.Root>
        </div>
    </div>
    <div class="mr-10">
        <div>
            <Card.Root>
                <Card.Content class="mt-5">
                  <div class="grid gap-6">
                    <Button>
                      Create Blog
                    </Button>
                    <div class="grid gap-3">
                      <Label for="status">Status</Label>
                      <select>
      
                      </select>
                    </div>
                    <div class="grid gap-3">
                      <Label for="status">Priority</Label>
                      <select>
      
                      </select>
                    </div>
                  </div>
                </Card.Content>
              </Card.Root>
        </div>
        <div>
            <Card.Root class="mt-5">
                <Card.Content class="mt-5">
                  <div class="grid gap-6">
                      <div class="grid gap-3">
                        <img 
                            src="/favicon.png"
                            alt="favicon"
                        />
                      </div>
                    <Button>
                      Add Image
                    </Button>
                  </div>
                </Card.Content>
              </Card.Root>
        </div>
    </div>
</div>