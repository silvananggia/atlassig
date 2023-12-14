import React from 'react';
import { Card, CardHeader, CardContent, CardActions, Button, Typography } from '@mui/material';

const DetailBox = ({ detailFKTP, activeFaskes, closeDetailBox }) => {

    const cardHeaderStyle = {
        background: "linear-gradient(to right, #0F816F, #274C8B)", // Adjust gradient colors as needed
        color: "white", // Set text color to contrast with the background
      };
    
      const titleStyle = {
        fontSize: "1.2rem", // Set the desired font size for the title
      };
    
      const subheaderStyle = {
        fontSize: "0.8rem", // Set the desired font size for the subheader
        color: "lightgray",
      };

  return (
    <div className="detail-box" onClick={closeDetailBox}>
          <Card sx={{ maxWidth: 350 }}>
            <CardHeader
              title={detailFKTP[0].nmppk || null}
              subheader={
                activeFaskes + ` | KODE FASKES : ${detailFKTP[0].faskesid || null}`
              }
              style={cardHeaderStyle}
              titleTypographyProps={{ style: titleStyle }}
              subheaderTypographyProps={{ style: subheaderStyle }}
            />
            <CardContent>
              <Typography fontSize={12}>
                <table className="table-card">
                  <tbody>
                    <tr>
                      <td style={{ width: "150px" }}>
                        <strong>KEDEPUTIAN WILAYAH</strong>
                      </td>
                      <td>
                        <strong>:</strong>
                      </td>
                      <td>{detailFKTP[0].kwppk || null}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>KANTOR CABANG</strong>
                      </td>
                      <td>
                        <strong>:</strong>
                      </td>
                      <td>{detailFKTP[0].kcppk || null}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>
                          {activeFaskes === "FKRTL" ? "KELAS RS" : "JENIS"}
                        </strong>
                      </td>
                      <td>
                        <strong>:</strong>
                      </td>
                      <td>
                        {activeFaskes === "FKRTL"
                          ? detailFKTP[0].kelasrs
                          : detailFKTP[0].jenisfaskes}
                      </td>
                    </tr>
                    {activeFaskes === "FKRTL" ? (
                      <tr>
                        <td>
                          <strong>PELAYANAN CANGGIH</strong>
                        </td>
                        <td>
                          <strong>:</strong>
                        </td>
                        <td>{detailFKTP[0].pelayanancanggih}</td>
                      </tr>
                    ) : null}
                    <tr>
                      <td>
                        <strong>ALAMAT</strong>
                      </td>
                      <td>
                        <strong>:</strong>
                      </td>
                      <td>{detailFKTP[0].alamatppk}</td>
                    </tr>
                  </tbody>
                </table>
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={closeDetailBox}>
                Tutup
              </Button>
            </CardActions>
          </Card>
        </div>
  );
};

export default DetailBox;
