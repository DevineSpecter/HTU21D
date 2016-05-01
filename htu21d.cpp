#include "mraa.h"
#include <stdio.h>
#include <unistd.h>

int main()
{
	mraa_i2c_context i2c;
	i2c = mraa_i2c_init(1);
	mraa_i2c_address(i2c, 0x40);

	uint8_t data = mraa_i2c_read_byte_data (i2c, 0xF7);
	printf("Register= %d \n", data);

	while(1){
		uint8_t buf[3];
		//temperature reading sequence
		mraa_i2c_read_bytes_data(i2c,0xE3,buf,3);
		uint8_t msb= buf[0];
		uint8_t lsb= buf[1];
		uint16_t data16 =((uint8_t) msb << 8)|(uint8_t)(lsb & 0xFC);
		float temp = (float)(-46.85 + (175.72 * data16 /(float)65536));
		printf("Temperature %f C \n",temp);
		//humidity reading sequence
		mraa_i2c_read_bytes_data(i2c,0xE5,buf,3);
		msb= buf[0];
		lsb= buf[1];
		data16=((uint8_t) msb << 8) | (uint8_t) (lsb & 0xFC);
		float hum = (float)(-6 +(125.0 * data16 / (float)65536));
		printf("Humidity %f %% \n",hum);

		usleep(1000000);
	}
	return MRAA_SUCCESS;
}

