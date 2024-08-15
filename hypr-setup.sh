# Root password (leave blank to be prompted).
ROOT_PASSWORD='root'

# The main user's password (leave blank to be prompted).
USER_PASSWORD='root'

configure() {
    echo 'Installing additional packages'
    install_packages

    echo 'Installing AUR packages'
    install_aur_packages

    echo 'Clearing package tarballs'
    clean_packages

    echo 'Updating pkgfile database'
    update_pkgfile

    echo 'Building locate database'
    update_locate

    echo 'Setting initial daemons'
    set_daemons 
}

install_packages() {
    pacman -Sy --noconfirm $(cat ~/Personal/Github/lazy-hypr/packages)
}

install_aur_packages() {
    mkdir /foo
    export TMPDIR=/foo
    yay --answerdiff None --answerclean All -S $(cat ~/Personal/Github/lazy-hypr/aur-packages)
    unset TMPDIR
    rm -rf /foo
}

clean_packages() {
    yes | pacman -Scc
}

update_pkgfile() {
    pkgfile -u
}

set_daemons() {
    systemctl enable keyd.service
}

update_locate() {
    updatedb
}




configure
