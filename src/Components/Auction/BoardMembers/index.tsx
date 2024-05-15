import SimpleCard from "@/Components/StyledComponents/SimpleCard";
import { Container, Grid, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import * as React from "react";
import { MdModeEdit,MdDelete  } from "react-icons/md";

export interface IBoardMembersProps {}

export default function BoardMembers(props: IBoardMembersProps) {
  return (
    <Container>
      <SimpleCard>
        <Grid container spacing={2} sx={{ mb: 2,mt: 0 }}>
          <Grid item lg={6} md={3} sm={12} xs={12}>
            <h5>Board Members</h5>
          </Grid>
          <Grid item lg={6} md={3} sm={12} xs={12} className="d-flex justify-content-end">
            <button className="main-button-blue">Add Member</button>
          </Grid>
        </Grid>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Deepak Rathore</TableCell>
              <TableCell>deepakrathore@gmail.com</TableCell>
              <TableCell>9874563210</TableCell>
              <TableCell>
                <MdModeEdit className="fs-4 text-primary me-2" />
                <MdDelete className="fs-4 text-danger" />
              </TableCell>
            </TableRow>
          </TableBody>

        </Table>
      </SimpleCard>
    </Container>
  );
}
