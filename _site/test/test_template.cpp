#include <iostream>
#include "libff/algebra/fields/fp.hpp"
#include "gmp.h"

using namespace libff;

int main() {
	bigint<1> modulus = bigint<1>("7");
	modulus.print();
	Fp_model<1, modulus> f2;
	return (0);
}
