import React from "react";
import { Button, Container, Stack, Typography} from "@mui/material";


const Hero=()=>{
    return(
        <Container maxWidth={false} sx={{  width: '100%' }}>
        <Typography
          variant="body1"
          sx={{
            fontSize: { xs: '20px', sm: '36px', md: '48px' },
            fontWeight: 'bolder',
            marginTop:{xs:"20px",md:"50px"}
          }}
        >
          Dive deep into the digital ocean of blogs and emerge enriched with a wealth of diverse viewpoints, novel concepts, and valuable wisdom.
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: { xs: '20px', sm: '24px', md: '24px' },
            width:{xs:"100%",sm:"90%",md:"70%"},
            marginTop:{xs:"20px",md:"30px"}
          }}
        >
         Wardesk is an open platform where readers find dynamic thinking and where expert and undiscovered voices can share their writing on any topic
        </Typography>
        <Stack direction="row" sx={{justifyContent:"space-between",marginTop:{xs:"20px",md:"30px"},width:"auto"}} >
        <Button variant="contained" color="primary">Start Reading</Button>
        <Button >Scroll down</Button>
        </Stack>
        <Stack sx={{justifyContent:"space-between",height:"2px",backgroundColor:"rgb(188, 181, 181)",marginTop:{xs:"20px",md:"30px"},width:"100%"}}>
        </Stack>
      </Container>
      
    )
}

export default Hero;