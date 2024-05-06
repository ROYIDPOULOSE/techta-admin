<script lang="ts">
    import * as Table from "$lib/components/ui/table/index.js";
   
    const student = [
      {
        studentID: "INV001",
        name: "Paid",
        address: "$250.00",
        phone: "Credit Card",
        status: "Active",
        totalAmount:"$250.00",
      },
      {
        studentID: "INV001",
        name: "Paid",
        address: "$250.00",
        phone: "Credit Card",
        status: "Active",
        totalAmount:"$250.00",
      },
      {
        studentID: "INV001",
        name: "Paid",
        address: "$250.00",
        phone: "Credit Card",
        status: "Active",
        totalAmount:"$250.00",
      },
      {
        studentID: "INV001",
        name: "Paid",
        address: "$250.00",
        phone: "Credit Card",
        status: "Active",
        totalAmount:"$250.00",
      },
      {
        studentID: "INV001",
        name: "Paid",
        address: "$250.00",
        phone: "Credit Card",
        status: "Active",
        totalAmount:"$250.00",
      },
      {
        studentID: "INV001",
        name: "Paid",
        address: "$250.00",
        phone: "Credit Card",
        status: "Active",
        totalAmount:"$250.00",
      },
      {
        studentID: "INV001",
        name: "Paid",
        address: "$250.00",
        phone: "Credit Card",
        status: "Active",
        totalAmount:"$250.00",
      },
      {
        studentID: "INV001",
        name: "Paid",
        address: "$250.00",
        phone: "Credit Card",
        status: "Active",
        totalAmount:"$250.00",
      },
    ];
  </script>
   
  <Table.Root>
    <Table.Caption>Student Details.</Table.Caption>
    <Table.Header>
      <Table.Row>
        <Table.Head class="w-[100px]">Student ID</Table.Head>
        <Table.Head>Name</Table.Head>
        <Table.Head>Address</Table.Head>
        <Table.Head>Phone</Table.Head>
        <Table.Head>Status</Table.Head>
        <Table.Head class="text-right">Amount</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each student as student, i (i)}
        <Table.Row>
          <Table.Cell class="font-medium">{student.studentID}</Table.Cell>
          <Table.Cell>{student.name}</Table.Cell>
          <Table.Cell>{student.address}</Table.Cell>
          <Table.Cell>{student.phone}</Table.Cell>
          <Table.Cell>{student.status}</Table.Cell>
          <Table.Cell class="text-right">{student.totalAmount}</Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>