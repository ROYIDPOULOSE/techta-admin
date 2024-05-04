<script lang="ts">
	import * as Card from '$lib/components/ui/card';

    export let course: { course: string; software: string; duration: number };
</script>

<Card.Root>
    <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
        <Card.Title class="text-sm font-bold">{course.course}</Card.Title>
    </Card.Header>
    <Card.Content>
        <p class="text-xs text-muted-foreground">{course.software}</p>
        <p class="text-xs text-muted-foreground">{course.duration} hours</p>
    </Card.Content>
</Card.Root>