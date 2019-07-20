#include <iostream>
#include "libff/algebra/fields/fp.hpp"
#include "gmp.h"

using namespace libff;

const long bigint_size = 10;
const bigint<bigint_size> modulus = bigint<bigint_size>("7");

int main() {
	Fp_model<bigint_size, modulus> f7 = Fp_model<bigint_size, modulus>(1);
	Fp_model<bigint_size, modulus> random_f7_elem = Fp_model<bigint_size, modulus>::one();
	unsigned long d = random_f7_elem.as_ulong();
	std::cout << d << std::endl;
	f7.print();
	return (0);
}
