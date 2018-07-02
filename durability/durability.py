#!/usr/bin/env python

import seaborn as sns
from matplotlib import pylab as plt
from scipy.stats import binom as bdist

N = 40
K = 32
F = .1

def binomial(n, k):
    if 0 <= k <= n:
        ntok = 1
        ktok = 1
    for t in range(1, min(k, n - k) + 1):
        ntok *= n
        ktok *= t
        n -= 1
        return ntok // ktok
    else:
        return 0

def nines(n, k, fail):
    val = str(bdist.cdf(n-k,n,fail))
    val = val[2:]
    counter = 0
    while True:   
        if val[counter:counter+1] == "9":
            counter += 1
        else:
            break
    return counter

colors = sns.cubehelix_palette(
    4, dark=0.1, light=1, start=0.5, rot=-.5, as_cmap=True)
ax = sns.heatmap(
    [[nines(n, k, F) for n in range(1,N+1)] for k in range(1,K+1)],
         xticklabels=[i if i % 4 == 0 else "" for i in range(1, N+1)],
         yticklabels=[i if i % 4 == 0 else "" for i in range(1, K+1)],
         cmap=colors,
         cbar_kws={"label": "9's after the decimal"},
         vmin=0,
         vmax=18
         )
ax.invert_yaxis()
plt.yticks(rotation=0)
plt.title("Durability assuming node failure of %d%%" % (
    int(F*100)))
plt.ylabel("k ", rotation=0)
plt.xlabel("n")
plt.savefig("durability.eps")