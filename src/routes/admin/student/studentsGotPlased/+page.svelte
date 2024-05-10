<script lang="ts">
    import * as Card from '$lib/components/ui/card';
    import { Button } from '$lib/components/ui/button';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
    import { Ellipsis } from 'lucide-svelte';

  </script>
  
<div class="p-10">
    <Card.Root class="w-60 rounded-lg shadow-md overflow-hidden transition-transform duration-300 transform-gpu hover:scale-105 hover:shadow-2xl">
        <div class="relative">
          <img src="/images/img1.webp" alt="Header Image" class="w-full h-24 object-cover" />
          <div class="absolute top-2 right-2">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button variant="ghost" size="sm" class="bg-white bg-opacity-30 rounded-full p-0">
                    <Ellipsis />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item>
                  <span>Edit</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  <span>Delete</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>
      
        <Card.Content class="p-3">
          <h2 class="text-base font-bold mb-1 leading-tight">Course Title</h2>
          <p class="text-gray-600 mb-3 text-xs leading-tight">
            This is a short description of the course. It provides an overview of what the course covers and what students can expect to learn.
          </p>
          <div class="flex mb-2 flex-wrap">
            <div class="flex items-center">
              <img src="/images/wife.jpg" alt="Instructor 2" class="w-6 h-6 rounded-full mr-2" />
              <span class="text-xs font-semibold whitespace-nowrap">Autodesk Construction Cloud</span>
            </div>
            <div class="flex items-center">
              <img src="/images/son.png" alt="Instructor 1" class="w-6 h-6 rounded-full mr-2" />
              <span class="text-xs font-semibold whitespace-nowrap">AutoCAD</span>
            </div>
            <div class="flex items-center">
              <img src="/images/img1.webp" alt="Instructor 3" class="w-6 h-6 rounded-full mr-2" />
              <span class="text-xs font-semibold whitespace-nowrap">Jijojo math</span>
            </div>
          </div>
        </Card.Content>
      
        <Card.Footer class="bg-gray-100 p-3 flex justify-between items-center">
            <div>
                <p class="font-semibold text-sm">8 hours</p>
            </div>
            <div>
                <p class="font-semibold text-sm">₹2,000</p>
            </div>
        </Card.Footer>
    </Card.Root>
</div>